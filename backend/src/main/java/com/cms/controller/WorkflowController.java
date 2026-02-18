package com.cms.controller;

import com.cms.model.ApprovalRequest;
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

    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalRequest>> getPendingApprovals() {
        return ResponseEntity.ok(workflowService.getPendingApprovals());
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<Void> approveRequest(@PathVariable Long id) {
        workflowService.approveRequest(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long id) {
        workflowService.rejectRequest(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }
}
