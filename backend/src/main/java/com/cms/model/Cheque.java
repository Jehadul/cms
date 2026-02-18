package com.cms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cheques", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "cheque_book_id", "chequeNumber" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cheque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cheque_book_id", nullable = false)
    private ChequeBook chequeBook;

    @Column(nullable = false)
    private Long chequeNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ChequeStatus status = ChequeStatus.UNUSED;

    // Use these fields when status is ISSUED or PRINTED
    private BigDecimal amount;
    private String payeeName;
    private LocalDate chequeDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ChequeWorkflowStatus workflowStatus = ChequeWorkflowStatus.DRAFT;

    // For VOID/MISSING status
    private String remarks;

    @Version
    private Long version;
}
