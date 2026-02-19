package com.cms.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalIssuedCount;
    private BigDecimal totalIssuedAmount;

    private long totalReceivedCount;
    private BigDecimal totalReceivedAmount;

    private long bouncedCount;
    private long pendingApprovalCount;

    private long chequesDueToday;
    private long incomingDueToday;

    private List<ActivityDTO> recentActivity;
}
