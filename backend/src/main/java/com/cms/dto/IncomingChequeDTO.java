package com.cms.dto;

import com.cms.model.IncomingChequeStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomingChequeDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String internalRef;
    private String chequeNumber;
    private LocalDate chequeDate;
    private LocalDate receivedDate;
    private String bankName;
    private String branchName;
    private BigDecimal amount;
    private String imagePath; // URL or base64 for display? Usually path relative to upload dir
    private IncomingChequeStatus status;
    private String remarks;
    private String invoiceNumber;
}
