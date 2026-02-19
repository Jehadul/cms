package com.cms.service;

import com.cms.model.Cheque;
import com.cms.model.ChequeTemplate;
import com.cms.repository.ChequeRepository;
import com.cms.repository.ChequeTemplateRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;

import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ChequePrintingService {

    @Autowired
    private ChequeRepository chequeRepository;

    @Autowired
    private ChequeTemplateRepository chequeTemplateRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public byte[] generateChequePdf(Long chequeId, Long templateId) throws IOException {
        Cheque cheque = chequeRepository.findById(chequeId)
                .orElseThrow(() -> new RuntimeException("Cheque not found"));

        ChequeTemplate template = chequeTemplateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        return createPdf(List.of(cheque), template);
    }

    public byte[] generateBatchChequePdf(List<Long> chequeIds, Long templateId) throws IOException {
        List<Cheque> cheques = chequeRepository.findAllById(chequeIds);
        if (cheques.isEmpty()) {
            throw new RuntimeException("No cheques found");
        }

        ChequeTemplate template = chequeTemplateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        return createPdf(cheques, template);
    }

    private byte[] createPdf(List<Cheque> cheques, ChequeTemplate template) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4); // Default A4, usually landscape for cheques?
            // If cheque is typical size, might need custom PageSize or A4 rotated.
            // The image looks like a standard cheque leaf, often printed on A4 or dedicated
            // printer.
            // Let's stick to A4 for now, assuming printer handles paper.

            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Load Fonts
            BaseFont helvetica = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            BaseFont helveticaBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252,
                    BaseFont.NOT_EMBEDDED);

            // Parse Layout Config
            Map<String, Map<String, Object>> layout = objectMapper.readValue(
                    template.getCanvasConfig(), new TypeReference<>() {
                    });

            for (Cheque cheque : cheques) {
                document.newPage();
                PdfContentByte cb = writer.getDirectContent();

                // 1. Payee
                drawField(cb, helvetica, helveticaBold, layout.get("payee"), cheque.getDisplayPayee());

                // 2. Amount Numeric
                drawField(cb, helvetica, helveticaBold, layout.get("amountNumeric"),
                        cheque.getAmount() != null ? String.format("%,.2f", cheque.getAmount()) : ""); // Added commas

                // 3. Date
                if (cheque.getChequeDate() != null) {
                    Map<String, Object> dateConfig = layout.get("date");
                    String dateFormat = (String) ((dateConfig != null) ? dateConfig.getOrDefault("format", "dd-MM-yyyy")
                            : "dd-MM-yyyy");

                    // If template wants generic spacing (dd MM yyyy) we format it here
                    String dateStr = cheque.getChequeDate().format(DateTimeFormatter.ofPattern(dateFormat));
                    drawField(cb, helvetica, helveticaBold, dateConfig, dateStr);
                }

                // 4. Amount in Words
                drawField(cb, helvetica, helveticaBold, layout.get("amountWords"),
                        convertAmountToWords(cheque.getAmount() != null ? cheque.getAmount().doubleValue() : 0));

                // 5. Bank Name (New)
                String bankName = cheque.getBankName(); // Uses the helper we added to Cheque.java
                drawField(cb, helvetica, helveticaBold, layout.get("bankName"), bankName);

                // 6. Company Name (New - Issuer)
                String companyName = "";
                if (cheque.getChequeBook() != null && cheque.getChequeBook().getAccount() != null
                        && cheque.getChequeBook().getAccount().getCompany() != null) {
                    companyName = cheque.getChequeBook().getAccount().getCompany().getName();
                }
                drawField(cb, helvetica, helveticaBold, layout.get("companyName"), companyName);

                // 7. A/C Payee Cross (New - Static usually, but controlled by layout)
                if (layout.containsKey("acPayee")) {
                    drawField(cb, helvetica, helveticaBold, layout.get("acPayee"), "A/C PAYEE ONLY");
                }

                // 8. Signature Label (New)
                if (layout.containsKey("signatureLabel")) {
                    drawField(cb, helvetica, helveticaBold, layout.get("signatureLabel"), "Authorized Signature");
                }
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private void drawField(PdfContentByte cb, BaseFont normalFont, BaseFont boldFont, Map<String, Object> fieldConfig,
            String text) {
        if (fieldConfig == null || text == null)
            return;

        try {
            float x = ((Number) fieldConfig.getOrDefault("x", 0)).floatValue();
            float y = ((Number) fieldConfig.getOrDefault("y", 0)).floatValue();
            float fontSize = ((Number) fieldConfig.getOrDefault("fontSize", 10)).floatValue();

            // Layout Options
            boolean isBold = (boolean) fieldConfig.getOrDefault("isBold", false);
            float rotation = ((Number) fieldConfig.getOrDefault("rotation", 0)).floatValue(); // Degrees
            float charSpacing = ((Number) fieldConfig.getOrDefault("charSpacing", 0)).floatValue();

            cb.saveState();
            cb.beginText();

            cb.setFontAndSize(isBold ? boldFont : normalFont, fontSize);

            if (charSpacing > 0) {
                cb.setCharacterSpacing(charSpacing);
            }

            if (rotation != 0) {
                // simple rotation around the start point (x, y)
                // Matrix: [ cos sin 0 ]
                // [ -sin cos 0 ]
                // [ x y 1 ]
                double rad = Math.toRadians(rotation);
                float cos = (float) Math.cos(rad);
                float sin = (float) Math.sin(rad);
                cb.setTextMatrix(cos, sin, -sin, cos, x, y);
            } else {
                cb.setTextMatrix(x, y);
            }

            cb.showText(text);
            cb.endText();
            cb.restoreState();

        } catch (Exception e) {
            System.err.println("Error drawing field: " + e.getMessage());
        }
    }

    private String convertAmountToWords(double amount) {
        long units = (long) amount;
        // int cents = (int) Math.round((amount - units) * 100);

        String words = convert(units) + " Taka Only"; // Customized for User request "Taka"
        // Adjust for cents if needed in future
        return words;
    }

    private static final String[] units = {
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] tens = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    private String convert(long n) {
        if (n < 0)
            return "Minus " + convert(-n);
        if (n < 20)
            return units[(int) n];
        if (n < 100)
            return tens[(int) n / 10] + ((n % 10 != 0) ? " " : "") + units[(int) n % 10];
        if (n < 1000)
            return units[(int) n / 100] + " Hundred" + ((n % 100 != 0) ? " " : "") + convert(n % 100);
        if (n < 100000)
            return convert(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " : "") + convert(n % 1000); // 1 Lakh =
                                                                                                       // 100,000 ??
                                                                                                       // Standard Int'l
                                                                                                       // is 100k = 100
                                                                                                       // Thousand.
        // User requested "Million" in image "One Million Taka Only".
        // 1 Million = 10,00,000 (10 Lakhs).
        // Let's stick to standard International Million/Billion if the user example
        // showed "One Million".
        // Wait, "One Million Taka Only" is in the image. So use Million logic.

        if (n < 1000000)
            return convert(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " : "") + convert(n % 1000);
        if (n < 1000000000)
            return convert(n / 1000000) + " Million" + ((n % 1000000 != 0) ? " " : "") + convert(n % 1000000);

        return convert(n / 1000000000) + " Billion" + ((n % 1000000000 != 0) ? " " : "") + convert(n % 1000000000);
    }
}
