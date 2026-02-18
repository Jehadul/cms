package com.cms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "incoming_cheques")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingCheque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, unique = true)
    private String internalRef; // Auto-generated

    @Column(nullable = false)
    private String chequeNumber;

    @Column(nullable = false)
    private LocalDate chequeDate;

    @Column(nullable = false)
    private LocalDate receivedDate;

    @Column(nullable = false)
    private String bankName; // Drawer's Bank

    private String branchName;

    @Column(nullable = false)
    private BigDecimal amount;

    private String imagePath; // Scanned copy

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IncomingChequeStatus status = IncomingChequeStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    // Optional invoice link placeholder
    private String invoiceNumber;
}
