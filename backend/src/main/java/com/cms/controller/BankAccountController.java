package com.cms.controller;

import com.cms.dto.BankAccountDTO;
import com.cms.service.BankAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
@CrossOrigin(origins = "*")
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;

    @GetMapping
    public ResponseEntity<List<BankAccountDTO>> getAccounts(@RequestParam(required = false) Long companyId) {
        if (companyId == null) {
            // TODO: infer from context or return empty
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(bankAccountService.getAccountsByCompany(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankAccountDTO> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(bankAccountService.getAccountById(id));
    }

    @PostMapping
    public ResponseEntity<BankAccountDTO> createAccount(@RequestBody BankAccountDTO dto) {
        return new ResponseEntity<>(bankAccountService.createAccount(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccountDTO> updateAccount(@PathVariable Long id, @RequestBody BankAccountDTO dto) {
        return ResponseEntity.ok(bankAccountService.updateAccount(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        bankAccountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
