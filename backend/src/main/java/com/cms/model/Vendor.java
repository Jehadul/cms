package com.cms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Company company;

    @Column(nullable = false)
    private String name;

    private String code;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String contactPerson;
    private String email;
    private String phone;

    // Bank Details
    private String bankName;
    private String bankBranch;
    private String accountNumber;
    private String ifscCode;

    // Payment Preferences
    @Enumerated(EnumType.STRING)
    private PaymentPreference paymentPreference;

    private Integer paymentTermsDays; // e.g., 30 for Net 30

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
