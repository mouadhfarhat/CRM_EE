package com.cmdpfe.demande.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmdpfe.demande.Entity.Notification;
import com.cmdpfe.demande.Repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    
    private NotificationRepository notificationRepo;

    @GetMapping("/{clientId}")
    public List<Notification> getClientNotifications(@PathVariable Long clientId) {
        return notificationRepo.findByClientIdOrderByCreatedAtDesc(clientId);
    }
}
