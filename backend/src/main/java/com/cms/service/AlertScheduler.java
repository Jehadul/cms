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
    private com.cms.repository.AlertConfigRepository alertConfigRepository;

    @Autowired
    private com.cms.repository.ChequeRepository chequeRepository;

    @Autowired
    private com.cms.repository.IncomingChequeRepository incomingChequeRepository;

    @Autowired
    private NotificationService notificationService;

    // Run every minute for Development/Test (Production should be daily or hourly)
    @Scheduled(fixedDelay = 60000)
    public void runDailyChecks() {
        System.out.println("Running Alert Checks (" + java.time.LocalDateTime.now() + ")...");

        List<AlertConfig> configs = alertConfigRepository.findAll();

        for (AlertConfig config : configs) {
            checkCompanyAlerts(config);
        }
    }

    private void checkCompanyAlerts(AlertConfig config) {
        if (config == null || config.getCompany() == null)
            return;

        Long companyId = config.getCompany().getId();
        LocalDate today = LocalDate.now();

        // 1. Outgoing PDCs Due Today
        if (config.isNotifyPdcDueToday()) {
            List<com.cms.model.Cheque> dueToday = chequeRepository.findByStatusAndChequeDate(
                    com.cms.model.ChequeStatus.ISSUED, today);
            List<com.cms.model.Cheque> markedDue = chequeRepository.findByStatusAndChequeDate(
                    com.cms.model.ChequeStatus.DUE, today);
            dueToday.addAll(markedDue);

            if (!dueToday.isEmpty()) {
                String msg = "You have " + dueToday.size() + " outgoing cheque(s) due today (" + today + ").";
                notificationService.sendAlert(companyId, "Outgoing Cheques Due Today", msg, "WARNING");
                System.out.println("Alert generated: " + msg);
            }
        }

        // 2. Outgoing PDCs Upcoming (based on config days)
        if (config.isNotifyPdcUpcoming()) {
            int days = config.getDaysBeforeUpcoming() > 0 ? config.getDaysBeforeUpcoming() : 1;
            LocalDate upcomingDate = today.plusDays(days);

            List<com.cms.model.Cheque> dueUpcoming = chequeRepository.findByStatusAndChequeDate(
                    com.cms.model.ChequeStatus.ISSUED, upcomingDate);

            if (!dueUpcoming.isEmpty()) {
                String msg = "You have " + dueUpcoming.size() + " outgoing cheque(s) due in " + days + " day(s) ("
                        + upcomingDate + ").";
                notificationService.sendAlert(companyId, "Upcoming Cheque Payments", msg, "INFO");
            }
        }

        // 3. Incoming Cheques (Receivables) Due Today
        List<com.cms.model.IncomingCheque> inDue = incomingChequeRepository.findByStatusAndChequeDate(
                com.cms.model.IncomingChequeStatus.PENDING, today);
        if (!inDue.isEmpty()) {
            String msg = "You have " + inDue.size() + " incoming cheque(s) to deposit today (" + today + ").";
            notificationService.sendAlert(companyId, "Incoming Cheques Deposit Today", msg, "INFO");
            System.out.println("Alert generated: " + msg);
        }
    }
}
