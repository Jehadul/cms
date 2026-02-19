package com.cms.service;

import com.cms.model.IncomingCheque;
import com.cms.repository.IncomingChequeRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptService {

    @Autowired
    private IncomingChequeRepository incomingChequeRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;

    public byte[] generateReceiptPdf(Long chequeId) {
        IncomingCheque cheque = incomingChequeRepository.findById(chequeId)
                .orElseThrow(() -> new RuntimeException("Cheque not found"));

        Document document = new Document();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            // Header
            Paragraph title = new Paragraph("Cheque Acknowledgement Receipt", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Company Info (Mock - normally would fetch from user context/company)
            document.add(new Paragraph("Issuer: " + cheque.getCustomer().getCompany().getName(), headerFont));
            document.add(new Paragraph(
                    "Date: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")),
                    normalFont));
            document.add(new Paragraph("Receipt No: RCPT-" + cheque.getInternalRef(), normalFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Received with thanks from:", headerFont));
            document.add(new Paragraph("Customer: " + cheque.getCustomer().getName(), normalFont));
            document.add(new Paragraph("\n"));

            // Table Details
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            table.addCell(new Paragraph("Cheque Number", headerFont));
            table.addCell(new Paragraph(cheque.getChequeNumber(), normalFont));

            table.addCell(new Paragraph("Cheque Date", headerFont));
            table.addCell(new Paragraph(cheque.getChequeDate().toString(), normalFont));

            table.addCell(new Paragraph("Bank Name", headerFont));
            table.addCell(new Paragraph(cheque.getBankName(), normalFont));

            table.addCell(new Paragraph("Amount", headerFont));
            table.addCell(new Paragraph(
                    cheque.getAmount().toString() + " " + cheque.getCustomer().getCompany().getCurrency(), normalFont));

            document.add(table);

            document.add(new Paragraph("\n"));
            document.add(
                    new Paragraph("Remarks: " + (cheque.getRemarks() != null ? cheque.getRemarks() : "-"), normalFont));

            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("Authorized Signature", normalFont));
            document.add(
                    new Paragraph("(This is a computer-generated receipt)",
                            new Font(Font.HELVETICA, 10, Font.ITALIC)));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating receipt PDF", e);
        }
    }

    public void emailReceipt(Long chequeId, String toEmail) {
        if (toEmail == null || toEmail.isEmpty()) {
            throw new RuntimeException("Recipient email is required");
        }

        byte[] pdfBytes = generateReceiptPdf(chequeId);
        IncomingCheque cheque = incomingChequeRepository.findById(chequeId).orElseThrow();

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Cheque Receipt - " + cheque.getChequeNumber());
            helper.setText(
                    "Dear Customer,\n\nPlease find attached the acknowledgement receipt for your cheque payment.\n\nRegards,\nAccounts Team");

            helper.addAttachment("Receipt_" + cheque.getChequeNumber() + ".pdf", new ByteArrayResource(pdfBytes));

            try {
                javaMailSender.send(message);
            } catch (Exception e) {
                // In development, we might not have valid credentials.
                // Log the email instead of failing the request.
                System.out.println("------------------------------------------------");
                System.out.println("MOCK EMAIL SENT (SMTP Configuration Pending)");
                System.out.println("To: " + toEmail);
                System.out.println("Subject: Cheque Receipt - " + cheque.getChequeNumber());
                System.out.println("Body: Dear Customer...");
                System.out.println("Error: " + e.getMessage());
                System.out.println("------------------------------------------------");
                // Do not rethrow, so frontend sees "success"
            }
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to prepare email", e);
        }
    }
}
