package com.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ChequeBookDTO {
    private Long id;
    private Long accountId;
    private String bankName;
    private String accountNumber;
    private String seriesIdentifier;
    private long startNumber;
    private long endNumber;
    private long currentNumber;
    private LocalDate issuedDate;
    private boolean active;

    // Stats (computed)
    private int totalLeaves;
    private int usedLeaves;
}
