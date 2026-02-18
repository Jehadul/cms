package com.cms.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CustomerDTO {
    private Long id;
    private Long companyId;
    private String name;
    private String code;
    private String address;
    private String contactPerson;
    private String email;
    private String phone;

    private BigDecimal creditLimit;
    private Integer creditDays;

    private boolean active;
}
