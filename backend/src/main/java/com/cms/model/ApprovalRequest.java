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

    // Who requested it
    @Column(nullable = false)
    private Long requestedBy;

    // Who approved it (null until approved)
    private Long approvedBy;

    // Current status of the request
    @Builder.Default
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();

    private LocalDateTime actionedAt;

    // Optional: Level of approval required or current level
    // private int currentLevel;
}
