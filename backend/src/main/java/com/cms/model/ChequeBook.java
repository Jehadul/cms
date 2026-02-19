package com.cms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "cheque_books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChequeBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private BankAccount account;

    private String seriesIdentifier; // e.g. "A"

    @Column(nullable = false)
    private long startNumber;

    @Column(nullable = false)
    private long endNumber;

    private long currentNumber; // The next number to be used

    private LocalDate issuedDate;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
