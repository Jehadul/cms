package com.cms.dto;

import com.cms.model.ChequeStatus;
import com.cms.model.ChequeWorkflowStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ChequeDTO {
    private Long id;
    private Long chequeBookId;
    private Long chequeNumber;
    private ChequeStatus status;
    private BigDecimal amount;
    private String payeeName;
    private LocalDate chequeDate;
    private Long vendorId;
    private String vendorName;
    private ChequeWorkflowStatus workflowStatus;
    private String remarks;
    private Integer printCount = 0;
}
