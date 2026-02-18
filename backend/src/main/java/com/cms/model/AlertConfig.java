package com.cms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alert_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // Toggles
    @Builder.Default
    private boolean emailEnabled = true;

    @Builder.Default
    private boolean smsEnabled = false; // Mock

    @Builder.Default
    private boolean inAppEnabled = true;

    // Specific Alert Types
    @Builder.Default
    private boolean notifyPdcDueToday = true;

    @Builder.Default
    private boolean notifyPdcUpcoming = true; // Pre-alert

    @Builder.Default
    private int daysBeforeUpcoming = 1; // Default 1 day before

    @Builder.Default
    private boolean notifyBounced = true;

    @Builder.Default
    private boolean notifyOverdue = true;

    // Recipients (comma separated emails)
    private String alertRecipients;
}
