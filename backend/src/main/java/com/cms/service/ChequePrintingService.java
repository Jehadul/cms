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
            Document document = new Document(PageSize.A4);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Load Font (Standard Helvetica for now, can be parameterized)
            BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);

            // Parse Layout Config
            Map<String, Map<String, Object>> layout = objectMapper.readValue(
                    template.getCanvasConfig(), new TypeReference<>() {
                    });

            for (Cheque cheque : cheques) {
                document.newPage();
                PdfContentByte cb = writer.getDirectContent();

                // Draw Fields based on Layout
                drawField(cb, bf, layout.get("payee"), cheque.getPayeeName());

                // Format amount
                drawField(cb, bf, layout.get("amountNumeric"),
                        cheque.getAmount() != null ? String.format("%.2f", cheque.getAmount()) : "");

                // Format date (assuming dd-MM-yyyy or configurable)
                if (cheque.getChequeDate() != null) {
                    drawField(cb, bf, layout.get("date"),
                            cheque.getChequeDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                }

                // Amount in words
                drawField(cb, bf, layout.get("amountWords"),
                        convertAmountToWords(cheque.getAmount() != null ? cheque.getAmount().doubleValue() : 0));

                // Add other fields as needed (Memo, etc.)
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private void drawField(PdfContentByte cb, BaseFont bf, Map<String, Object> fieldConfig, String text) {
        if (fieldConfig == null || text == null)
            return;

        try {
            float x = ((Number) fieldConfig.getOrDefault("x", 0)).floatValue();
            float y = ((Number) fieldConfig.getOrDefault("y", 0)).floatValue(); // Y is from bottom-left usually in PDF
            float fontSize = ((Number) fieldConfig.getOrDefault("fontSize", 12)).floatValue();

            // Adjust Y coordinate if the frontend sends top-left based coordinates
            // Assuming A4 height ~842 points
            // float pdfY = 842 - y;
            // For now, let's assume config stores PDF coordinates or handle conversion

            cb.beginText();
            cb.setFontAndSize(bf, fontSize);
            cb.setTextMatrix(x, y);
            cb.showText(text);
            cb.endText();
        } catch (Exception e) {
            // Ignore field specific error to continue printing other fields
            System.err.println("Error drawing field: " + e.getMessage());
        }
    }

    private String convertAmountToWords(double amount) {
        // Simple English implementation for demonstration
        // For production, use a library like 'tradukisto' or IBM ICU

        long units = (long) amount;
        int cents = (int) Math.round((amount - units) * 100);

        String words = convert(units) + " Only";
        if (cents > 0) {
            words += " and " + convert(cents) + "/100";
        }
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
            return convert(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " : "") + convert(n % 1000);
        if (n < 10000000)
            return convert(n / 100000) + " Lakh" + ((n % 100000 != 0) ? " " : "") + convert(n % 100000);
        return convert(n / 10000000) + " Crore" + ((n % 10000000 != 0) ? " " : "") + convert(n % 10000000);
    }
}
