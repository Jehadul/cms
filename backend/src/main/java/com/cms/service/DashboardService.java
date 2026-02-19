package com.cms.service;

import com.cms.dto.ActivityDTO;
import com.cms.dto.DashboardStatsDTO;
import com.cms.dto.PdcSummaryDTO;
import com.cms.model.Cheque;
import com.cms.model.IncomingCheque;
import com.cms.repository.ApprovalRequestRepository;
import com.cms.repository.ChequeRepository;
import com.cms.repository.IncomingChequeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private ChequeRepository chequeRepository;

    @Autowired
    private IncomingChequeRepository incomingChequeRepository;

    @Autowired
    private ApprovalRequestRepository approvalRequestRepository;

    public DashboardStatsDTO getStats() {
        // 1. Get Summaries
        List<PdcSummaryDTO> outSummary = chequeRepository.getOutgoingChequeSummary();
        List<PdcSummaryDTO> inSummary = incomingChequeRepository.getIncomingChequeSummary();

        long totalIssued = 0;
        BigDecimal totalIssuedAmt = BigDecimal.ZERO;
        long totalReceived = 0;
        BigDecimal totalReceivedAmt = BigDecimal.ZERO;
        long bounced = 0;

        for (PdcSummaryDTO s : outSummary) {
            if ("BOUNCED".equals(s.getStatus()) || "RETURNED".equals(s.getStatus())) {
                bounced += s.getCount();
            }
            if (!"CANCELLED".equals(s.getStatus()) && !"VOID".equals(s.getStatus())) {
                totalIssued += s.getCount();
                if (s.getTotalAmount() != null)
                    totalIssuedAmt = totalIssuedAmt.add(s.getTotalAmount());
            }
        }

        for (PdcSummaryDTO s : inSummary) {
            if ("BOUNCED".equals(s.getStatus()) || "RETURNED".equals(s.getStatus())) {
                bounced += s.getCount();
            }
            if (!"CANCELLED".equals(s.getStatus())) {
                totalReceived += s.getCount();
                if (s.getTotalAmount() != null)
                    totalReceivedAmt = totalReceivedAmt.add(s.getTotalAmount());
            }
        }

        // 2. Due Today
        LocalDate today = LocalDate.now();
        List<Cheque> dueOut = chequeRepository.findByStatusAndChequeDate(com.cms.model.ChequeStatus.ISSUED, today);
        List<IncomingCheque> dueIn = incomingChequeRepository
                .findByStatusAndChequeDate(com.cms.model.IncomingChequeStatus.PENDING, today);

        // 3. Approvals
        long pending = approvalRequestRepository.findByStatus("PENDING").size();

        // 4. Recent Activity
        List<ActivityDTO> activity = new ArrayList<>();
        List<Cheque> recentCheques = chequeRepository.findTop5ByOrderByIdDesc();
        for (Cheque c : recentCheques) {
            activity.add(ActivityDTO.builder()
                    .id(c.getId())
                    .type("OUTGOING")
                    .description(c.getDisplayPayee())
                    .amount(c.getAmount())
                    .date(c.getChequeDate())
                    .status(c.getStatus().name())
                    .build());
        }

        List<IncomingCheque> recentInCheques = incomingChequeRepository.findTop5ByOrderByIdDesc();
        for (IncomingCheque c : recentInCheques) {
            String desc = (c.getCustomer() != null) ? c.getCustomer().getName() : "Unknown Customer";
            activity.add(ActivityDTO.builder()
                    .id(c.getId())
                    .type("INCOMING")
                    .description(desc)
                    .amount(c.getAmount())
                    .date(c.getChequeDate())
                    .status(c.getStatus().name())
                    .build());
        }

        // Mix and sort by Date descending
        activity.sort(Comparator.comparing(ActivityDTO::getDate, Comparator.nullsLast(Comparator.reverseOrder())));
        if (activity.size() > 5) {
            activity = activity.subList(0, 5);
        }

        return DashboardStatsDTO.builder()
                .totalIssuedCount(totalIssued)
                .totalIssuedAmount(totalIssuedAmt)
                .totalReceivedCount(totalReceived)
                .totalReceivedAmount(totalReceivedAmt)
                .bouncedCount(bounced)
                .pendingApprovalCount(pending)
                .chequesDueToday(dueOut.size())
                .incomingDueToday(dueIn.size())
                .recentActivity(activity)
                .build();
    }
}
