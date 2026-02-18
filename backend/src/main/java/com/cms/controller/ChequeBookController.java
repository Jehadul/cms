package com.cms.controller;

import com.cms.dto.ChequeBookDTO;
import com.cms.dto.ChequeDTO;
import com.cms.model.ChequeStatus;
import com.cms.service.ChequeBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cheque-books")
@CrossOrigin(origins = "*")
public class ChequeBookController {

    @Autowired
    private ChequeBookService chequeBookService;

    @GetMapping
    public ResponseEntity<List<ChequeBookDTO>> getChequeBooks(@RequestParam Long accountId) {
        return ResponseEntity.ok(chequeBookService.getChequeBooksByAccount(accountId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChequeBookDTO> getChequeBookById(@PathVariable Long id) {
        return ResponseEntity.ok(chequeBookService.getChequeBookById(id));
    }

    @GetMapping("/{id}/cheques")
    public ResponseEntity<List<ChequeDTO>> getChequesByBook(@PathVariable Long id) {
        return ResponseEntity.ok(chequeBookService.getChequesByBook(id));
    }

    @PostMapping
    public ResponseEntity<ChequeBookDTO> createChequeBook(@RequestBody ChequeBookDTO dto) {
        return new ResponseEntity<>(chequeBookService.createChequeBook(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/cheques/{chequeId}/status")
    public ResponseEntity<ChequeDTO> updateChequeStatus(
            @PathVariable Long chequeId,
            @RequestBody Map<String, String> payload) {

        String statusStr = payload.get("status");
        String remarks = payload.get("remarks");
        ChequeStatus status = ChequeStatus.valueOf(statusStr);

        return ResponseEntity.ok(chequeBookService.updateChequeStatus(chequeId, status, remarks));
    }

    @PostMapping("/outgoing")
    public ResponseEntity<ChequeDTO> createOutgoingCheque(@RequestBody ChequeDTO dto) {
        return ResponseEntity.ok(chequeBookService.createOutgoingCheque(dto));
    }
}
