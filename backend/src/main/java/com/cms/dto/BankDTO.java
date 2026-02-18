package com.cms.dto;

import lombok.Data;

@Data
public class BankDTO {
    private Long id;
    private String name;
    private String code;
    private String branchCode;
    private String routingNumber;
    private String swiftCode;
    private Long defaultTemplateId; // Reference ID
    private String defaultTemplateName; // For display
    private boolean active;
}
