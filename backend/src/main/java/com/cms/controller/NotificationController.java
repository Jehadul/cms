package com.cms.controller;

import com.cms.model.Notification;
import com.cms.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam(required = false) Long companyId) {
        if (companyId != null) {
            return ResponseEntity.ok(notificationRepository.findByCompanyIdOrderByCreatedAtDesc(companyId));
        }
        return ResponseEntity.ok(List.of()); // Or return all if admin
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }
}
