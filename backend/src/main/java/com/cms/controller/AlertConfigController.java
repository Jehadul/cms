package com.cms.controller;

import com.cms.model.AlertConfig;
import com.cms.model.Company;
import com.cms.repository.AlertConfigRepository;
import com.cms.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alert-configs")
@CrossOrigin(origins = "*")
public class AlertConfigController {

    @Autowired
    private AlertConfigRepository alertConfigRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/{companyId}")
    public ResponseEntity<AlertConfig> getConfig(@PathVariable Long companyId) {
        return ResponseEntity.ok(alertConfigRepository.findByCompanyId(companyId)
                .orElseGet(() -> createDefaultConfig(companyId)));
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<AlertConfig> updateConfig(@PathVariable Long companyId, @RequestBody AlertConfig config) {
        AlertConfig existing = alertConfigRepository.findByCompanyId(companyId).orElse(null);
        if (existing == null) {
            existing = createDefaultConfig(companyId);
        }

        // Update fields
        existing.setEmailEnabled(config.isEmailEnabled());
        existing.setSmsEnabled(config.isSmsEnabled());
        existing.setInAppEnabled(config.isInAppEnabled());

        existing.setNotifyPdcDueToday(config.isNotifyPdcDueToday());
        existing.setNotifyPdcUpcoming(config.isNotifyPdcUpcoming());
        existing.setDaysBeforeUpcoming(config.getDaysBeforeUpcoming());
        existing.setNotifyBounced(config.isNotifyBounced());
        existing.setNotifyOverdue(config.isNotifyOverdue());

        existing.setAlertRecipients(config.getAlertRecipients());

        return ResponseEntity.ok(alertConfigRepository.save(existing));
    }

    private AlertConfig createDefaultConfig(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        AlertConfig config = new AlertConfig();
        config.setCompany(company);
        // Defaults are set in the entity model
        return alertConfigRepository.save(config);
    }
}
