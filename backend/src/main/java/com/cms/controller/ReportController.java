package com.cms.controller;

import com.cms.dto.ReportFilterDTO;
import com.cms.model.Cheque;
import com.cms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/data")
    public ResponseEntity<List<Cheque>> getReportData(@RequestBody ReportFilterDTO filter) {
        return ResponseEntity.ok(reportService.generateReportData(filter));
    }

    @PostMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody ReportFilterDTO filter) {
        byte[] data = reportService.exportToPdf(reportService.generateReportData(filter));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    @PostMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestBody ReportFilterDTO filter) {
        byte[] data = reportService.exportToExcel(reportService.generateReportData(filter));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @PostMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(@RequestBody ReportFilterDTO filter) {
        byte[] data = reportService.exportToCsv(reportService.generateReportData(filter));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(data);
    }
}
