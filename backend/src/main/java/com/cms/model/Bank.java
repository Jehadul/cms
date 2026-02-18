package com.cms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(unique = true, nullable = false)
    private String code; // Bank Code

    private String branchCode; // As per specific requirement

    private String routingNumber;

    private String swiftCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_template_id")
    private ChequeTemplate defaultTemplate;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
