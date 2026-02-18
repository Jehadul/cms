package com.cms.controller;

import com.cms.service.ChequePrintingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/printing")
@CrossOrigin(origins = "*")
public class ChequePrintingController {

    @Autowired
    private ChequePrintingService chequePrintingService;

    @GetMapping("/cheque/{chequeId}/template/{templateId}")
    public ResponseEntity<byte[]> printCheque(
            @PathVariable Long chequeId,
            @PathVariable Long templateId) {
        try {
            byte[] pdfBytes = chequePrintingService.generateChequePdf(chequeId, templateId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cheque_" + chequeId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/batch/template/{templateId}")
    public ResponseEntity<byte[]> printBatchCheques(
            @RequestBody List<Long> chequeIds,
            @PathVariable Long templateId) {
        try {
            byte[] pdfBytes = chequePrintingService.generateBatchChequePdf(chequeIds, templateId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=batch_cheques.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
