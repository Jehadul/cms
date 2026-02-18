
package com.cms.service;

import com.cms.dto.ReportFilterDTO;
import com.cms.model.Cheque;
import com.cms.repository.ChequeRepository;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ChequeRepository chequeRepository;

    public ReportService(ChequeRepository chequeRepository) {
        this.chequeRepository = chequeRepository;
    }

    public List<Cheque> generateReportData(ReportFilterDTO filter) {
        return chequeRepository.findAll().stream()
                .filter(c -> {
                    if (filter.getCompanyId() != null) {
                        try {
                            return c.getChequeBook().getAccount().getCompany().getId().equals(filter.getCompanyId());
                        } catch (NullPointerException e) {
                            return false;
                        }
                    }
                    return true;
                })
                .filter(c -> {
                    if (filter.getBankId() != null) {
                        try {
                            return c.getChequeBook().getAccount().getBranch().getBank().getId()
                                    .equals(filter.getBankId());
                        } catch (NullPointerException e) {
                            return false;
                        }
                    }
                    return true;
                })
                .filter(c -> filter.getStatus() == null || filter.getStatus().isEmpty()
                        || c.getStatus().name().equalsIgnoreCase(filter.getStatus()))
                .collect(Collectors.toList());
    }

    public byte[] exportToPdf(List<Cheque> data) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Cheque Report"));
            document.add(new Paragraph("Generated on: " + java.time.LocalDateTime.now()));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);

            table.addCell("Cheque No");
            table.addCell("Payee");
            table.addCell("Amount");
            table.addCell("Date");
            table.addCell("Status");
            table.addCell("Bank");

            for (Cheque c : data) {
                table.addCell(String.valueOf(c.getChequeNumber()));
                table.addCell(c.getPayeeName() != null ? c.getPayeeName() : "");
                table.addCell(c.getAmount() != null ? c.getAmount().toString() : "");
                table.addCell(c.getChequeDate() != null ? c.getChequeDate().toString() : "");
                table.addCell(c.getStatus().name());

                String bankName = "";
                try {
                    bankName = c.getChequeBook().getAccount().getBranch().getBank().getName();
                } catch (Exception e) {
                    /* ignore */ }
                table.addCell(bankName);
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF Generation Error", e);
        }
    }

    public byte[] exportToExcel(List<Cheque> data) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Cheques");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Cheque No");
            header.createCell(1).setCellValue("Payee");
            header.createCell(2).setCellValue("Amount");
            header.createCell(3).setCellValue("Date");
            header.createCell(4).setCellValue("Status");
            header.createCell(5).setCellValue("Bank");

            int rowIdx = 1;
            for (Cheque c : data) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(c.getChequeNumber());
                row.createCell(1).setCellValue(c.getPayeeName() != null ? c.getPayeeName() : "");
                row.createCell(2).setCellValue(c.getAmount() != null ? c.getAmount().doubleValue() : 0);
                row.createCell(3).setCellValue(c.getChequeDate() != null ? c.getChequeDate().toString() : "");
                row.createCell(4).setCellValue(c.getStatus().name());

                String bankName = "";
                try {
                    bankName = c.getChequeBook().getAccount().getBranch().getBank().getName();
                } catch (Exception e) {
                    /* ignore */ }
                row.createCell(5).setCellValue(bankName);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Excel Generation Error", e);
        }
    }

    public byte[] exportToCsv(List<Cheque> data) {
        StringBuilder sb = new StringBuilder();
        sb.append("Cheque No,Payee,Amount,Date,Status,Bank\n");
        for (Cheque c : data) {
            sb.append(c.getChequeNumber()).append(",");
            sb.append("\"").append(c.getPayeeName() != null ? c.getPayeeName() : "").append("\",");
            sb.append(c.getAmount() != null ? c.getAmount() : "").append(",");
            sb.append(c.getChequeDate() != null ? c.getChequeDate() : "").append(",");
            sb.append(c.getStatus().name()).append(",");

            String bankName = "";
            try {
                bankName = c.getChequeBook().getAccount().getBranch().getBank().getName();
            } catch (Exception e) {
                /* ignore */ }
            sb.append("\"").append(bankName).append("\"\n");
        }
        return sb.toString().getBytes();
    }
}
