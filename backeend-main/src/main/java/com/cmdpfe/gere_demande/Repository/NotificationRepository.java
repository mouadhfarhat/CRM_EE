package com.cmdpfe.gere_demande.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.gere_demande.Entity.*;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByClientIdOrderByCreatedAtDesc(Long clientId);
    boolean existsByClientAndTypeAndMessage(Client client, NotificationType type, String message);

}
