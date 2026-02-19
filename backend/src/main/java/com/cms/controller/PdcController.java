package com.cms.controller;

import com.cms.dto.PdcSummaryDTO;
import com.cms.model.Cheque;
import com.cms.model.IncomingCheque;
import com.cms.service.PdcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pdc")
@CrossOrigin(origins = "*")
public class PdcController {

    @Autowired
    private PdcService pdcService;

    @GetMapping("/exposure")
    public ResponseEntity<List<PdcSummaryDTO>> getPdcExposureReport() {
        return ResponseEntity.ok(pdcService.getPdcExposureReport());
    }

    @PostMapping("/run-check")
    public ResponseEntity<String> runPdcCheck() {
        pdcService.runPdcCheckNow();
        return ResponseEntity.ok("PDC Check executed.");
    }

    @GetMapping("/outgoing-details")
    public ResponseEntity<List<Cheque>> getOutgoingExposureDetails() {
        return ResponseEntity.ok(pdcService.getActiveOutgoingCheques());
    }

    @GetMapping("/incoming-details")
    public ResponseEntity<List<IncomingCheque>> getIncomingExposureDetails() {
        return ResponseEntity.ok(pdcService.getActiveIncomingCheques());
    }
}
