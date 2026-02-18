package com.cms.controller;

import com.cms.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "*")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping("/download/{chequeId}")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long chequeId) {
        byte[] pdfBytes = receiptService.generateReceiptPdf(chequeId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt_" + chequeId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PostMapping("/email/{chequeId}")
    public ResponseEntity<Void> emailReceipt(@PathVariable Long chequeId, @RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        receiptService.emailReceipt(chequeId, email);
        return ResponseEntity.ok().build();
    }
}
