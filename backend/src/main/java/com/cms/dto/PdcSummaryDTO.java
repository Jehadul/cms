package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PdcSummaryDTO {
    private String type; // "Incoming" or "Outgoing"
    private Long count;
    private BigDecimal totalAmount;
    private String status;
}
