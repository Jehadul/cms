package com.cms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String ifscCode;

    private String routingCode;

    private String contactNumber;
    private String email;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
