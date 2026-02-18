package com.cms.controller;

import com.cms.dto.BankDTO;
import com.cms.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banks")
@CrossOrigin(origins = "*")
public class BankController {

    @Autowired
    private BankService bankService;

    @GetMapping
    public ResponseEntity<List<BankDTO>> getAllBanks() {
        return ResponseEntity.ok(bankService.getAllBanks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankDTO> getBankById(@PathVariable Long id) {
        return ResponseEntity.ok(bankService.getBankById(id));
    }

    @PostMapping
    public ResponseEntity<BankDTO> createBank(@RequestBody BankDTO bankDTO) {
        return new ResponseEntity<>(bankService.createBank(bankDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankDTO> updateBank(@PathVariable Long id, @RequestBody BankDTO bankDTO) {
        return ResponseEntity.ok(bankService.updateBank(id, bankDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBank(@PathVariable Long id) {
        bankService.deleteBank(id);
        return ResponseEntity.noContent().build();
    }
}
