package com.cms.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogDTO {
    private Long id;
    private String entityType;
    private Long entityId;
    private String action;
    private Long userId;
    private String username;
    private String oldValue;
    private String newValue;
    private LocalDateTime timestamp;
}
