
package com.cmdpfe.gere_demande.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import org.springframework.web.server.ResponseStatusException;
import com.cmdpfe.gere_demande.Entity.Client;
import com.cmdpfe.gere_demande.Entity.ClientGroup;
import com.cmdpfe.gere_demande.Entity.DemandeStatut;
import com.cmdpfe.gere_demande.Entity.DemandeType;
import com.cmdpfe.gere_demande.Entity.Formation;
import com.cmdpfe.gere_demande.Entity.Notification;
import com.cmdpfe.gere_demande.Entity.NotificationType;
import com.cmdpfe.gere_demande.Repository.ClientGroupRepository;
import com.cmdpfe.gere_demande.Repository.ClientRepository;
import com.cmdpfe.gere_demande.Repository.DemandeRepository;
import com.cmdpfe.gere_demande.Repository.FormationRepository;
import com.cmdpfe.gere_demande.Repository.NotificationRepository;
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
    
    /**
     * 1) List formations whose deadline is today or earlier
     */
    @GetMapping("/formations/deadline")
    public ResponseEntity<List<Formation>> getFormationsByDeadline() {
        LocalDate today = LocalDate.now();
        List<Formation> formations = formationRepo.findFormationsEligibleForGroups(today);
        return ResponseEntity.ok(formations);
    }

    /**
     * 2) Fetch eligible clients (type=REJOINDRE & statut=TERMINE)
     */
    @GetMapping("/demandes/eligible")
    public ResponseEntity<List<Client>> getEligibleClients(@RequestParam Long formationId) {
        List<Client> clients = demandeRepo.findByEligibleClients(
            formationId,
            DemandeType.REJOINDRE,
            DemandeStatut.TERMINE
        );
        return ResponseEntity.ok(clients);
    }

    /**
     * 3) Create a new ClientGroup with selected clients + send notification
     */
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
        selectedClients.forEach(c -> {
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
        });

        return ResponseEntity.ok(savedGroup);
    }

    /**
     * 4) Search groups by formation
     */
    @GetMapping("/search")
    public ResponseEntity<List<ClientGroup>> searchGroupsByFormation(@RequestParam Long formationId) {
        List<ClientGroup> groups = groupRepo.findByFormationId(formationId);
        return ResponseEntity.ok(groups);
    }

    /**
     * 5) Get all groups
     */
    @GetMapping
    public ResponseEntity<List<ClientGroup>> getAllGroups() {
        return ResponseEntity.ok(groupRepo.findAll());
    }

    /**
     * 6) Add client to group
     */
    @PostMapping("/{groupId}/clients/{clientId}")
    public ResponseEntity<ClientGroup> addClientToGroup(@PathVariable Long groupId,
                                                         @PathVariable Long clientId) {
        ClientGroup group = groupRepo.findById(groupId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        Client client = clientRepo.findById(clientId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        group.addClient(client);
        return ResponseEntity.ok(groupRepo.save(group));
    }

    /**
     * 7) Remove client from group
     */
    @DeleteMapping("/{groupId}/clients/{clientId}")
    public ResponseEntity<Void> removeClientFromGroup(@PathVariable Long groupId,
                                                      @PathVariable Long clientId) {
        ClientGroup group = groupRepo.findById(groupId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        Client client = clientRepo.findById(clientId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        group.removeClient(client);
        groupRepo.save(group);
        return ResponseEntity.noContent().build();
    }

    /**
     * 8) Delete group
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long groupId) {
        if (!groupRepo.existsById(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }
        groupRepo.deleteById(groupId);
        return ResponseEntity.noContent().build();
    }
}

