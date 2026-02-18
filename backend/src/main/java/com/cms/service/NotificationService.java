package com.cms.service;

import com.cms.model.AlertConfig;
import com.cms.model.Notification;
import com.cms.repository.AlertConfigRepository;
import com.cms.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AlertConfigRepository alertConfigRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;

    public void sendAlert(Long companyId, String title, String message, String type) {
        AlertConfig config = alertConfigRepository.findByCompanyId(companyId).orElse(null);

        // 1. In-App Notification
        if (config == null || config.isInAppEnabled()) {
            Notification notification = Notification.builder()
                    .companyId(companyId)
                    .title(title)
                    .message(message)
                    .type(type) // INFO, WARNING, ERROR
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }

        // 2. Email Notification
        if (config != null && config.isEmailEnabled() && config.getAlertRecipients() != null
                && !config.getAlertRecipients().isEmpty()) {
            sendEmail(config.getAlertRecipients(), title, message);
        }

        // 3. SMS Notification (Mock)
        if (config != null && config.isSmsEnabled()) {
            System.out.println("[SMS MOCK] Sending SMS to configured number: " + title + " - " + message);
        }
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            // Handle multiple recipients split by comma
            String[] recipients = to.split(",");
            message.setTo(recipients);
            message.setSubject(subject);
            message.setText(body);
            javaMailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send alert email: " + e.getMessage());
        }
    }
}
