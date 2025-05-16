package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.Client;
import com.cmdpfe.demande.Entity.ClientGroup;
import com.cmdpfe.demande.Entity.DemandeStatut;
import com.cmdpfe.demande.Entity.DemandeType;
import com.cmdpfe.demande.Entity.Formation;
import com.cmdpfe.demande.Entity.Notification;
import com.cmdpfe.demande.Entity.NotificationType;
import com.cmdpfe.demande.Repository.ClientGroupRepository;
import com.cmdpfe.demande.Repository.ClientRepository;
import com.cmdpfe.demande.Repository.DemandeRepository;
import com.cmdpfe.demande.Repository.FormationRepository;
import com.cmdpfe.demande.Repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/groups")
public class ClientGroupController {

    @Autowired
    private ClientGroupRepository groupRepo;
    @Autowired
    private FormationRepository formationRepo;
    @Autowired
    private ClientRepository clientRepo;
    @Autowired
    private NotificationRepository notificationRepo;
    @Autowired
    private DemandeRepository demandeRepo;
    
    @GetMapping("/formations/deadline")
    public ResponseEntity<List<Formation>> getFormationsByDeadline() {
        LocalDate today = LocalDate.now();
        List<Formation> formations = formationRepo.findFormationsEligibleForGroups(today);
        return ResponseEntity.ok(formations);
    }


    // 2) Fetch eligible clients (type=REJOINDRE & statut=TERMINE)
    @GetMapping("/demandes/eligible")
    public ResponseEntity<List<Client>> getEligibleClients(@RequestParam Long formationId) {
        List<Client> clients = demandeRepo.findEligibleClients(
            formationId,
            DemandeType.REJOINDRE,
            DemandeStatut.TERMINE
        );
        return ResponseEntity.ok(clients);
    }

    // 3) Create a new ClientGroup with selected clients + notify them
    @PostMapping
    public ResponseEntity<ClientGroup> createGroup(
        @RequestParam Long formationId,
        @RequestParam String name,
        @RequestParam List<Long> clientIds
    ) {
        Formation formation = formationRepo.findById(formationId)
        		.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formation not found"));
        ClientGroup group = new ClientGroup(name, formation);
        List<Client> selectedClients = clientRepo.findAllById(clientIds);
        group.setClients(new HashSet<>(selectedClients));

        ClientGroup savedGroup = groupRepo.save(group);

        // Notify each added client
        for (Client c : selectedClients) {
            Notification n = new Notification();
            n.setClient(c);
            n.setTitle("Vous avez été ajouté au groupe « " + savedGroup.getName() + " »");
            n.setMessage("Bonjour " + c.getFirstname() + ", vous faites maintenant partie du groupe « "
                          + savedGroup.getName() + " » pour la formation « "
                          + formation.getTitle() + " ».");
            n.setType(NotificationType.GROUP_CREATED);
            n.setCreatedAt(LocalDateTime.now());
            n.setRead(false);
            notificationRepo.save(n);
        }

        return ResponseEntity.ok(savedGroup);
    }



/*
    // Create a new group under a formation
    @PostMapping
    public ResponseEntity<ClientGroup> createGroup(@RequestParam Long formationId,
                                                   @RequestParam String name) {
        Optional<Formation> formOpt = formationRepo.findById(formationId);
        if (formOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Formation formation = formOpt.get();
        ClientGroup group = new ClientGroup(name, formation);
        ClientGroup savedGroup = groupRepo.save(group);

        // Notify interested clients
        for (Client client : formation.getInterestedClients()) {
            Notification notification = new Notification();
            notification.setClient(client);
            notification.setTitle("New Group Created");
            notification.setMessage("A new group \"" + group.getName() + "\" has been created for the formation \"" + formation.getTitle() + "\".");
            notification.setType(NotificationType.GROUP_CREATED);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false); // Mark as unread initially
            notificationRepo.save(notification);
        }

        return ResponseEntity.ok(savedGroup);
    }

    */
    
    
    
 // 🔎 Get all groups by Formation ID
    @GetMapping("/search")
    public ResponseEntity<List<ClientGroup>> searchGroupsByFormation(@RequestParam Long formationId) {
        List<ClientGroup> groups = groupRepo.findByFormationId(formationId);
        return ResponseEntity.ok(groups);
    }

    // Get all groups
    @GetMapping
    public List<ClientGroup> getAllGroups() {
        return groupRepo.findAll();
    }

    // Search groups by formation
    @GetMapping("/by-formation/{formationId}")
    public ResponseEntity<List<ClientGroup>> getGroupsByFormation(@PathVariable Long formationId) {
        List<ClientGroup> groups = groupRepo.findByFormationId(formationId);
        return ResponseEntity.ok(groups);
    }

    // Add client to group
    @PostMapping("/{groupId}/clients/{clientId}")
    public ResponseEntity<ClientGroup> addClientToGroup(@PathVariable Long groupId,
                                                         @PathVariable Long clientId) {
        Optional<ClientGroup> groupOpt = groupRepo.findById(groupId);
        Optional<Client> clientOpt = clientRepo.findById(clientId);
        if (groupOpt.isEmpty() || clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ClientGroup group = groupOpt.get();
        group.addClient(clientOpt.get());
        return ResponseEntity.ok(groupRepo.save(group));
    }

    // Remove client from group
    @DeleteMapping("/{groupId}/clients/{clientId}")
    public ResponseEntity<Void> removeClientFromGroup(@PathVariable Long groupId,
                                                      @PathVariable Long clientId) {
        Optional<ClientGroup> groupOpt = groupRepo.findById(groupId);
        Optional<Client> clientOpt = clientRepo.findById(clientId);
        if (groupOpt.isEmpty() || clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ClientGroup group = groupOpt.get();
        group.removeClient(clientOpt.get());
        groupRepo.save(group);
        return ResponseEntity.noContent().build();
    }

    // Delete group
    @DeleteMapping("/{groupId}")
    public void deleteGroup(@PathVariable Long groupId) {
        groupRepo.deleteById(groupId);
    }
 // In ClientGroupController
    @GetMapping("/searchByName")
    public ResponseEntity<List<ClientGroup>> searchGroupsByName(@RequestParam String name) {
        List<ClientGroup> results = groupRepo.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(results);
    }
    
 // In ClientGroupController
    @GetMapping("/{groupId}/clients/count")
    public ResponseEntity<Long> countClientsInGroup(@PathVariable Long groupId) {
        Optional<ClientGroup> g = groupRepo.findById(groupId);
        return g.map(gr ->
            ResponseEntity.ok((long) gr.getClients().size())
        ).orElseGet(() -> ResponseEntity.notFound().build());
    }


}
