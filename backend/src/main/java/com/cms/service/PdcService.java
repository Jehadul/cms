package com.cms.service;

import com.cms.dto.PdcSummaryDTO;
import com.cms.model.Cheque;
import com.cms.model.ChequeStatus;
import com.cms.model.IncomingCheque;
import com.cms.model.IncomingChequeStatus;
import com.cms.repository.ChequeRepository;
import com.cms.repository.IncomingChequeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdcService {

    @Autowired
    private IncomingChequeRepository incomingChequeRepository;

    @Autowired
    private ChequeRepository chequeRepository;

    /**
     * Auto transition PDCs to DUE status when Cheque Date arrives.
     * Runs daily at midnight.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void processDuePdcs() {
        LocalDate today = LocalDate.now();

        // 1. Process Incoming Cheques
        // Created/Pending -> Due
        List<IncomingCheque> dueIncoming = incomingChequeRepository
                .findByStatusAndChequeDateLessThanEqual(IncomingChequeStatus.PENDING, today);
        for (IncomingCheque cheque : dueIncoming) {
            cheque.setStatus(IncomingChequeStatus.DUE);
        }
        if (!dueIncoming.isEmpty()) {
            incomingChequeRepository.saveAll(dueIncoming);
            System.out.println("Updated " + dueIncoming.size() + " Incoming Cheques to DUE.");
        }

        // 2. Process Outgoing Cheques
        // Issued/Printed -> Due
        List<Cheque> dueOutgoingIssued = chequeRepository.findByStatusAndChequeDateLessThanEqual(ChequeStatus.ISSUED,
                today);
        for (Cheque cheque : dueOutgoingIssued) {
            cheque.setStatus(ChequeStatus.DUE);
        }

        List<Cheque> dueOutgoingPrinted = chequeRepository.findByStatusAndChequeDateLessThanEqual(ChequeStatus.PRINTED,
                today);
        for (Cheque cheque : dueOutgoingPrinted) {
            cheque.setStatus(ChequeStatus.DUE);
        }

        if (!dueOutgoingIssued.isEmpty() || !dueOutgoingPrinted.isEmpty()) {
            chequeRepository.saveAll(dueOutgoingIssued);
            chequeRepository.saveAll(dueOutgoingPrinted);
            System.out.println(
                    "Updated " + (dueOutgoingIssued.size() + dueOutgoingPrinted.size()) + " Outgoing Cheques to DUE.");
        }
    }

    public List<PdcSummaryDTO> getPdcExposureReport() {
        List<PdcSummaryDTO> report = new ArrayList<>();
        report.addAll(incomingChequeRepository.getIncomingChequeSummary());
        report.addAll(chequeRepository.getOutgoingChequeSummary());
        return report;
    }

    // Manual trigger for testing
    public void runPdcCheckNow() {
        processDuePdcs();
    }

    public List<Cheque> getActiveOutgoingCheques() {
        return chequeRepository.findActiveOutgoingCheques();
    }

    public List<IncomingCheque> getActiveIncomingCheques() {
        return incomingChequeRepository.findActiveIncomingCheques();
    }
}
