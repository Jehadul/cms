package com.cms.controller;

import com.cms.dto.AuditLogDTO;
import com.cms.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogDTO>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllAuditLogs());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAuditLogs() {
        List<AuditLogDTO> logs = auditLogService.getAllAuditLogs();

        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("ID,Timestamp,User,Entity Type,Entity ID,Action,Old Value,New Value\n");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (AuditLogDTO log : logs) {
            csvBuilder.append(log.getId()).append(",")
                    .append(log.getTimestamp() != null ? log.getTimestamp().format(formatter) : "").append(",")
                    .append(escapeSpecialCharacters(log.getUsername())).append(",")
                    .append(escapeSpecialCharacters(log.getEntityType())).append(",")
                    .append(log.getEntityId()).append(",")
                    .append(escapeSpecialCharacters(log.getAction())).append(",")
                    .append(escapeSpecialCharacters(log.getOldValue())).append(",")
                    .append(escapeSpecialCharacters(log.getNewValue())).append("\n");
        }

        byte[] csvBytes = csvBuilder.toString().getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "audit_logs.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null) {
            return "";
        }
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }
}
