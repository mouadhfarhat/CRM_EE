package com.cmdpfe.gere_demande.Controller;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cmdpfe.gere_demande.Entity.CalendrierEvent;
import com.cmdpfe.gere_demande.Entity.Client;
import com.cmdpfe.gere_demande.Entity.ClientGroup;
import com.cmdpfe.gere_demande.Entity.Formation;
import com.cmdpfe.gere_demande.Entity.Notification;
import com.cmdpfe.gere_demande.Entity.NotificationType;
import com.cmdpfe.gere_demande.Repository.CalendrierEventRepository;
import com.cmdpfe.gere_demande.Repository.ClientGroupRepository;
import com.cmdpfe.gere_demande.Repository.FormationRepository;
import com.cmdpfe.gere_demande.Repository.NotificationRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/events")
public class CalendrierEventController {

    @Autowired
    private CalendrierEventRepository eventRepo;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private NotificationRepository notificationRepo;
    @Autowired
    private ClientGroupRepository groupRepository;


    @PostMapping
    @Transactional
    public ResponseEntity<CalendrierEvent> createEvent(@RequestBody CalendrierEvent event) {

        // 1. Load Formation
        if (event.getFormation() == null || event.getFormation().getId() == null) {
            throw new RuntimeException("Formation must be provided");
        }
        Formation formation = formationRepository.findById(event.getFormation().getId())
                .orElseThrow(() -> new RuntimeException("Formation not found"));
        event.setFormation(formation);

        // 2. Load Groups selected
        List<ClientGroup> selectedGroups = new ArrayList<>();
        if (event.getGroups() != null && !event.getGroups().isEmpty()) {
            for (ClientGroup group : event.getGroups()) {
                if (group.getId() != null) {
                    ClientGroup managedGroup = groupRepository.findById(group.getId())
                            .orElseThrow(() -> new RuntimeException("Group with id " + group.getId() + " not found"));
                    selectedGroups.add(managedGroup);
                }
            }
        }
        event.setGroups(selectedGroups);

        // 3. Automatically attach Clients from selected Groups (NOT formation)
        Set<Client> clientsToNotify = new HashSet<>();
        for (ClientGroup group : selectedGroups) {
            if (group.getClients() != null) {
                clientsToNotify.addAll(group.getClients());
            }
        }
        event.setClients(new ArrayList<>(clientsToNotify));

        // 4. Save Event
        CalendrierEvent saved = eventRepo.save(event);

        // 5. Notify clients linked to the selected Groups
        if (!saved.getClients().isEmpty()) {
            String title = "Nouvel événement: " + saved.getTitle();
            String message = String.format(
                    "Événement « %s » pour la formation « %s » %s du %s au %s.",
                    saved.getTitle(),
                    formation.getTitle(),
                    !saved.getGroups().isEmpty() ? "(Groupes: " +
                            saved.getGroups().stream()
                                    .map(ClientGroup::getName)
                                    .collect(Collectors.joining(", ")) + ")" : "",
                    saved.getStartTime(),
                    saved.getEndTime()
            );

            List<Notification> notifications = saved.getClients().stream().map(client -> {
                Notification notif = new Notification();
                notif.setClient(client);
                notif.setType(NotificationType.CALENDAR_EVENT);
                notif.setTitle(title);
                notif.setMessage(message);
                return notif;
            }).toList();

            notificationRepo.saveAll(notifications);
        }

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<CalendrierEvent> getAllEvents() {
        return eventRepo.findAll();
    }

    @GetMapping("/{id}")
    public CalendrierEvent getEventById(@PathVariable Long id) {
        return eventRepo.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<CalendrierEvent> updateEvent(@PathVariable Long id, @RequestBody CalendrierEvent updatedEvent) {
        return eventRepo.findById(id)
            .map(event -> {
                // Update basic fields
                event.setTitle(updatedEvent.getTitle());
                event.setStartTime(updatedEvent.getStartTime());
                event.setEndTime(updatedEvent.getEndTime());
                event.setType(updatedEvent.getType());
                event.setStatus(updatedEvent.getStatus());
                event.setBackgroundColor(updatedEvent.getBackgroundColor());
                event.setBorderColor(updatedEvent.getBorderColor());
                event.setGestionnaire(updatedEvent.getGestionnaire());

                // Update clients
                event.getClients().clear();
                if (updatedEvent.getClients() != null) {
                    event.getClients().addAll(updatedEvent.getClients());
                }

                // Update formation
                if (updatedEvent.getFormation() != null && updatedEvent.getFormation().getId() != null) {
                    Formation formation = formationRepository.findById(updatedEvent.getFormation().getId())
                        .orElseThrow(() -> new RuntimeException("Formation not found"));
                    event.setFormation(formation);
                } else {
                    event.setFormation(null);
                }

                // Update groups - this is the main change
                event.getGroups().clear();
                if (updatedEvent.getGroups() != null && !updatedEvent.getGroups().isEmpty()) {
                    List<ClientGroup> managedGroups = updatedEvent.getGroups().stream()
                        .map(group -> {
                            if (group.getId() != null) {
                                return groupRepository.findById(group.getId())
                                    .orElseThrow(() -> new RuntimeException("Group with id " + group.getId() + " not found"));
                            }
                            return group;
                        })
                        .collect(Collectors.toList());
                    event.getGroups().addAll(managedGroups);
                }

                CalendrierEvent savedEvent = eventRepo.save(event);
                return ResponseEntity.ok(savedEvent);
            })
            .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventRepo.deleteById(id);
    }
}
