package com.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReportFilterDTO {
    private Long companyId;
    private Long bankId;
    private String status; // PENDING, ISSUED, CLEARED, BOUNCED, CANCELLED
    private Long userId; // Created by
    private LocalDate startDate;
    private LocalDate endDate;
    private String reportType; // REGISTER, PDC, CLEARED, BOUNCED, PENDING, OVERDUE
}
