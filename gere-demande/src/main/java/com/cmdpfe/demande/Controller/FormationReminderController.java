package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:4200")
public class FormationReminderController {

    @Autowired
    private FormationRepository formationRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    @GetMapping("/send-today")
    public ResponseEntity<String> sendTodayReminders() {
        LocalDate today = LocalDate.now();

        List<Formation> formationsStartingToday = formationRepo.findByDateDebutWithGroups(today);

        for (Formation formation : formationsStartingToday) {
            for (ClientGroup group : formation.getGroups()) {
                for (Client client : group.getClients()) {
                    boolean alreadyNotified = notificationRepo.existsByClientAndTypeAndMessage(
                        client,
                        NotificationType.REMINDER,
                        "Today is the start of your formation " + formation.getTitle() + "."
                    );

                    if (!alreadyNotified) {
                        Notification notification = new Notification();
                        notification.setClient(client);
                        notification.setTitle("Formation Reminder");
                        notification.setMessage("Today is the start of your formation " + formation.getTitle() + ".");
                        notification.setType(NotificationType.REMINDER);
                        notification.setRead(false);
                        notification.setCreatedAt(LocalDateTime.now());
                        notificationRepo.save(notification);
                    }
                }
            }
        }

        return ResponseEntity.ok("Reminders sent successfully!");
    }
}
