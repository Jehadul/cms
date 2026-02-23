package com.cms.service;

import com.cms.dto.AuditLogDTO;
import com.cms.model.AuditLog;
import com.cms.model.User;
import com.cms.repository.AuditLogRepository;
import com.cms.repository.UserRepository;
import com.cms.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void logAction(String entityType, Long entityId, String action, String oldValue, String newValue) {
        Long userId = getCurrentUserId();
        AuditLog log = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .userId(userId)
                .oldValue(oldValue)
                .newValue(newValue)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLogDTO> getAllAuditLogs() {
        return auditLogRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getId();
        }
        return null;
    }

    private String getUsernameById(Long userId) {
        if (userId == null)
            return "System";
        return userRepository.findById(userId).map(User::getUsername).orElse("Unknown");
    }

    private AuditLogDTO convertToDTO(AuditLog log) {
        return AuditLogDTO.builder()
                .id(log.getId())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .action(log.getAction())
                .userId(log.getUserId())
                .username(getUsernameById(log.getUserId()))
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .timestamp(log.getTimestamp())
                .build();
    }
}
