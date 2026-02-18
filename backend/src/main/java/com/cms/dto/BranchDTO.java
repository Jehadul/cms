package com.cms.dto;

import lombok.Data;

@Data
public class BranchDTO {
    private Long id;
    private Long bankId;
    private String bankName;
    private String name;
    private String address;
    private String ifscCode;
    private String routingCode;
    private String contactNumber;
    private String email;
    private boolean active;
}
