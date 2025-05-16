package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.Client;
import com.cmdpfe.demande.Entity.Demande;
import com.cmdpfe.demande.Entity.Formation;
import com.cmdpfe.demande.Entity.Notification;
import com.cmdpfe.demande.Repository.ClientRepository;
import com.cmdpfe.demande.Repository.DemandeRepository;
import com.cmdpfe.demande.Repository.NotificationRepository;
import com.cmdpfe.demande.jwt.CustomJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DemandeRepository demandeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Client> getProfile() {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        return clientOpt.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    @PutMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Client> updateProfile(@RequestBody Client updatedClient) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Client client = clientOpt.get();
        client.setFirstname(updatedClient.getFirstname());
        client.setLastname(updatedClient.getLastname());
        client.setPhoneNumber(updatedClient.getPhoneNumber());
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @GetMapping("/notifications")
    @PreAuthorize("hasRole('CLIENT')")
    public List<Notification> getNotifications() {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            throw new RuntimeException("Client not found");
        }
        return notificationRepository.findByClient(clientOpt.get());
    }

    @GetMapping("/formations")
    @PreAuthorize("hasRole('CLIENT')")
    public List<Formation> getFormationHistory() {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            throw new RuntimeException("Client not found");
        }
        return demandeRepository.findByClientId(clientOpt.get().getId())
                .stream()
                .map(Demande::getFormation)
                .distinct()
                .toList();
    }
}