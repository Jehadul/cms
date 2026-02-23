package com.cms.service;

import com.cms.model.ApprovalRequest;
import com.cms.repository.ApprovalRequestRepository;
import com.cms.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkflowService {

        @Autowired
        private ApprovalRequestRepository approvalRequestRepository;

        @Autowired
        private AuditLogService auditLogService;

        @Autowired
        private ChequeBookService chequeBookService;

        // --- Approval Workflow ---

        private static final java.math.BigDecimal HIGH_VALUE_THRESHOLD = new java.math.BigDecimal("100000");

        public ApprovalRequest createApprovalRequest(String entityType, Long entityId, String actionType,
                        String payload,
                        Long userId, java.math.BigDecimal amount) {
                ApprovalRequest request = ApprovalRequest.builder()
                                .entityType(entityType)
                                .entityId(entityId)
                                .actionType(actionType)
                                .payload(payload)
                                .requestedBy(userId)
                                .amount(amount)
                                .status("PENDING")
                                .currentStage("CHECKER") // Initial stage
                                .requestedAt(LocalDateTime.now())
                                .build();

                auditLogService.logAction(entityType, entityId, "WORKFLOW_INITIATED", "User:" + userId,
                                "Stage: CHECKER, Action: " + actionType);
                return approvalRequestRepository.save(request);
        }

        public List<ApprovalRequest> getPendingApprovals() {
                return approvalRequestRepository.findByStatus("PENDING");
        }

        @Transactional
        public void approveRequest(Long requestId, Long approverId, Role approverRole) {
                ApprovalRequest request = approvalRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                if (!"PENDING".equals(request.getStatus())) {
                        throw new RuntimeException("Request is not pending.");
                }

                if ("CHECKER".equals(request.getCurrentStage())) {
                        if (approverRole != Role.CHECKER && approverRole != Role.ADMIN) {
                                throw new RuntimeException("Current stage requires Checker approval");
                        }
                        request.setCheckedBy(approverId);
                        request.setCurrentStage("APPROVER");
                        auditLogService.logAction(request.getEntityType(), request.getEntityId(), "WORKFLOW_CHECKED",
                                        "Stage: CHECKER", "Stage: APPROVER");
                } else if ("APPROVER".equals(request.getCurrentStage())) {
                        if (approverRole != Role.APPROVER && approverRole != Role.ADMIN) {
                                throw new RuntimeException("Current stage requires Approver approval");
                        }
                        request.setApprovedBy(approverId);

                        // Value based routing
                        if (request.getAmount() != null && request.getAmount().compareTo(HIGH_VALUE_THRESHOLD) > 0) {
                                request.setCurrentStage("FINANCE");
                                auditLogService.logAction(request.getEntityType(), request.getEntityId(),
                                                "WORKFLOW_APPROVED_PENDING_FINANCE", "Stage: APPROVER",
                                                "Stage: FINANCE (High Value)");
                        } else {
                                completeApproval(request, approverId);
                        }
                } else if ("FINANCE".equals(request.getCurrentStage())) {
                        if (approverRole != Role.FINANCE_MANAGER && approverRole != Role.ADMIN) {
                                throw new RuntimeException("Current stage requires Finance Manager approval");
                        }
                        request.setAuthorizedBy(approverId);
                        completeApproval(request, approverId);
                }

                request.setActionedAt(LocalDateTime.now());
                approvalRequestRepository.save(request);
        }

        private void completeApproval(ApprovalRequest request, Long finalApproverId) {
                String prevStage = request.getCurrentStage();
                request.setCurrentStage("APPROVED");
                request.setStatus("APPROVED");
                auditLogService.logAction(request.getEntityType(), request.getEntityId(), "WORKFLOW_FULLY_APPROVED",
                                prevStage, "APPROVED");

                if ("Cheque".equals(request.getEntityType()) && "ISSUE".equals(request.getActionType())) {
                        chequeBookService.executeApprovedChequeIssue(request.getEntityId(), request.getPayload());
                }
        }

        @Transactional
        public void rejectRequest(Long requestId, Long rejectorId) {
                ApprovalRequest request = approvalRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                String oldStage = request.getCurrentStage();
                request.setStatus("REJECTED");
                request.setCurrentStage("REJECTED");
                request.setActionedAt(LocalDateTime.now());
                approvalRequestRepository.save(request);

                auditLogService.logAction(request.getEntityType(), request.getEntityId(),
                                "WORKFLOW_REJECTED_" + request.getActionType(), oldStage, "REJECTED by " + rejectorId);

                if ("Cheque".equals(request.getEntityType()) && "ISSUE".equals(request.getActionType())) {
                        chequeBookService.executeRejectedChequeIssue(request.getEntityId());
                }
        }

        // --- Removed simple logAudit method because we now use AuditLogService
        // globally ---
        // Make sure WorkflowService imports model.Role and service.AuditLogService
}
