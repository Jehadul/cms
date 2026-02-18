package com.cms.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PdcSummaryDTO {
    private String type; // "Incoming" or "Outgoing"
    private Long count;
    private BigDecimal totalAmount;
    private String status;
}
