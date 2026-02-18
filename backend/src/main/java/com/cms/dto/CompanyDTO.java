package com.cms.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CompanyDTO {
    private Long id;
    private String name;
    private String code;
    private String address;
    private boolean active;

    private String financialYearStart;
    private String financialYearEnd;
    private String timezone;
    private String currency;

    private boolean makerCheckerEnabled;
    private int defaultApprovalLevels;

    private MultipartFile logoFile; // For upload
    private String logoPath; // For response
}
