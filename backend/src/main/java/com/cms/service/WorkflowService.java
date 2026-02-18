package com.cms.service;

import com.cms.model.ApprovalRequest;
import com.cms.model.AuditLog;
import com.cms.repository.ApprovalRequestRepository;
import com.cms.repository.AuditLogRepository;
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
    private AuditLogRepository auditLogRepository;

    // --- Approval Workflow ---

    public ApprovalRequest createApprovalRequest(String entityType, Long entityId, String actionType, String payload,
            Long userId) {
        ApprovalRequest request = ApprovalRequest.builder()
                .entityType(entityType)
                .entityId(entityId)
                .actionType(actionType)
                .payload(payload)
                .requestedBy(userId)
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();
        return approvalRequestRepository.save(request);
    }

    public List<ApprovalRequest> getPendingApprovals() {
        return approvalRequestRepository.findByStatus("PENDING");
    }

    @Transactional
    public void approveRequest(Long requestId, Long approverId) {
        ApprovalRequest request = approvalRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("APPROVED");
        request.setApprovedBy(approverId);
        request.setActionedAt(LocalDateTime.now());
        approvalRequestRepository.save(request);

        // Here we would typically trigger the actual action (callback or event)
        // For now, we just log it. In a real system, you might use an event bus.
        logAudit(request.getEntityType(), request.getEntityId(), "APPROVED_" + request.getActionType(), approverId,
                "PENDING", "APPROVED");
    }

    @Transactional
    public void rejectRequest(Long requestId, Long approverId) {
        ApprovalRequest request = approvalRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("REJECTED");
        request.setApprovedBy(approverId); // Or rejectedBy
        request.setActionedAt(LocalDateTime.now());
        approvalRequestRepository.save(request);

        logAudit(request.getEntityType(), request.getEntityId(), "REJECTED_" + request.getActionType(), approverId,
                "PENDING", "REJECTED");
    }

    // --- Audit Trail ---

    public void logAudit(String entityType, Long entityId, String action, Long userId, String oldValue,
            String newValue) {
        AuditLog log = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .userId(userId)
                .oldValue(oldValue)
                .newValue(newValue)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }
}
