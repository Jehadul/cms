package com.cms.dto;

import com.cms.model.PaymentPreference;
import lombok.Data;

@Data
public class VendorDTO {
    private Long id;
    private Long companyId;
    private String name;
    private String code;
    private String address;
    private String contactPerson;
    private String email;
    private String phone;

    private String bankName;
    private String bankBranch;
    private String accountNumber;
    private String ifscCode;

    private PaymentPreference paymentPreference;
    private Integer paymentTermsDays;

    private boolean active;
}
