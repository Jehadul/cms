package com.cms.controller;

import com.cms.model.ApprovalRequest;
import com.cms.model.Role;
import com.cms.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflow")
@CrossOrigin(origins = "*")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    // TODO: Get userId from SecurityContext
    private Long getCurrentUserId() {
        return 1L; // Mock for now
    }

    @PostMapping("/request")
    public ResponseEntity<ApprovalRequest> createRequest(@RequestBody java.util.Map<String, Object> payloadMap) {
        String entityType = (String) payloadMap.get("entityType");
        Long entityId = payloadMap.get("entityId") != null ? Long.valueOf(payloadMap.get("entityId").toString()) : null;
        String actionType = (String) payloadMap.get("actionType");
        String payload = (String) payloadMap.get("payload");
        java.math.BigDecimal amount = null;
        if (payloadMap.get("amount") != null) {
            amount = new java.math.BigDecimal(payloadMap.get("amount").toString());
        }

        ApprovalRequest request = workflowService.createApprovalRequest(
                entityType, entityId, actionType, payload, getCurrentUserId(), amount);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalRequest>> getPendingApprovals() {
        return ResponseEntity.ok(workflowService.getPendingApprovals());
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<Void> approveRequest(@PathVariable Long id) {
        workflowService.approveRequest(id, getCurrentUserId(), Role.ADMIN);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long id) {
        workflowService.rejectRequest(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }
}
