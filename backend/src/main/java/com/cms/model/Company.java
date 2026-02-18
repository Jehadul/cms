package com.cms.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    private String address;

    private String financialYearStart; // e.g., "04-01" (MM-DD)
    private String financialYearEnd; // e.g., "03-31" (MM-DD)

    private String timezone; // e.g., "Asia/Kolkata"
    private String currency; // e.g., "INR"

    private String logoPath;

    @Builder.Default
    @Column(nullable = false)
    private boolean makerCheckerEnabled = true;

    @Builder.Default
    @Column(nullable = false)
    private int defaultApprovalLevels = 1;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
