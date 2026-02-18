package com.cms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String name;

    private String code;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String contactPerson;
    private String email;
    private String phone;

    // Credit Terms
    private BigDecimal creditLimit;
    private Integer creditDays;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
