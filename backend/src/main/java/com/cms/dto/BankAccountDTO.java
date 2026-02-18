package com.cms.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BankAccountDTO {
    private Long id;
    private Long companyId;
    private String companyName;
    private Long branchId;
    private String branchName;
    private String bankName; // Helper
    private String accountNumber;
    private String accountType;
    private String currency;
    private Long defaultTemplateId;
    private String defaultTemplateName;
    private BigDecimal balance;
    private boolean active;
}
