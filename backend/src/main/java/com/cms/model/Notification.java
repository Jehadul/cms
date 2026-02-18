package com.cms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ideally link to User, but for now we might link to Company or just store a
    // target identifier
    // For simplicity in this demo, let's assume system-wide or company-wide broad
    // alerts,
    // or we'll just store a simple "recipient" string (e.g., "ADMIN", "FINANCE")

    private Long companyId; // The company this alert belongs to

    private String type; // INFO, WARNING, ERROR, SUCCESS

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    private boolean isRead = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Optional: Link to related entity
    private String relatedEntity; // "InCheque", "OutCheque"
    private Long relatedEntityId;
}
