package com.cms.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ActivityDTO {
    private Long id;
    private String type; // "OUTGOING", "INCOMING"
    private String description; // Payee or Payer
    private BigDecimal amount;
    private LocalDate date;
    private String status;
}
