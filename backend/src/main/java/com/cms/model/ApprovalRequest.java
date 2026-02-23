package com.cms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "approval_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The entity this request is for (e.g., "Cheque", "IncomingCheque")
    @Column(nullable = false)
    private String entityType;

    // The ID of the specific entity (e.g., cheque ID)
    @Column(nullable = false)
    private Long entityId;

    // The action requested (e.g., "CREATE", "PRINT", "STATUS_CHANGE")
    @Column(nullable = false)
    private String actionType;

    // JSON or relevant data representing proposed changes
    @Column(columnDefinition = "TEXT")
    private String payload;

    // Who requested it (MAKER)
    @Column(nullable = false)
    private Long requestedBy;

    // Track approvals
    private Long checkedBy; // Who performed checker role
    private Long approvedBy; // Who performed approver role
    private Long authorizedBy; // Who performed final finance authorization

    private String currentStage; // CHECKER, APPROVER, FINANCE, APPROVED, REJECTED

    // Decimal amount for value-based routing
    private java.math.BigDecimal amount;

    // Current status of the request
    @Builder.Default
    @Column(nullable = false)
    private String status = "PENDING"; // Summary status: PENDING, APPROVED, REJECTED

    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();

    private LocalDateTime actionedAt;

    // Optional: Level of approval required or current level
    // private int currentLevel;
}
