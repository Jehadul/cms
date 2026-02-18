package com.cms.service;

import com.cms.model.AlertConfig;
import com.cms.repository.AlertConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AlertScheduler {

    @Autowired
    private AlertConfigRepository alertConfigRepository;

    // Repositories will typically be used here for checks
    // private final ChequeRepository chequeRepository;
    // private final IncomingChequeRepository incomingChequeRepository;
    // private final CompanyRepository companyRepository;

    // Notification Service
    // private final NotificationService notificationService;

    // Run daily at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void runDailyChecks() {
        System.out.println("Running Daily Alert Checks...");

        // Iterate per company to respect configs
        // For efficiency, we would query companies first or use native queries
        // But for this demo, let's fetch all configs or assume system level scan
        // Better: Find all configs
        List<AlertConfig> configs = alertConfigRepository.findAll();

        for (AlertConfig config : configs) {
            checkCompanyAlerts(config);
        }
    }

    private void checkCompanyAlerts(AlertConfig config) {
        Long companyId = config.getCompany().getId();
        LocalDate today = LocalDate.now();

        // 1. Outgoing PDCs Due Today
        if (config.isNotifyPdcDueToday()) {
            // Logic to check repository
            System.out.println("Checking alerts for Company ID: " + companyId + " for date: " + today);
        }

        // In a real app, we would inject specific query results here.
        // For the sake of the demo, let's simulate ONE check if we had repository
        // methods
        // List<Cheque> dueCheques =
        // chequeRepository.findByCompanyIdAndChequeDate(companyId, today);
        // ...

        // Since we are building this incrementally, I will just log that we would scan
        // here
    }
}
