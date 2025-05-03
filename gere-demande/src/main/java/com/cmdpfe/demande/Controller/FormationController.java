package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;
import com.cmdpfe.demande.jwt.CustomJwt;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/formations")
public class FormationController {

    private final FormationRepository formationRepository;
    private final DemandeRepository demandeRepository;
    private final NotificationRepository notificationRepository;
    private final ClientRepository clientRepository;

    public FormationController(FormationRepository formationRepository,
                               DemandeRepository demandeRepository,
                               NotificationRepository notificationRepository,ClientRepository clientRepository) {
        this.formationRepository = formationRepository;
        this.demandeRepository = demandeRepository;
        this.notificationRepository = notificationRepository;
        this.clientRepository = clientRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Formation createFormation(@RequestBody Formation formation) {
        Formation saved = formationRepository.save(formation);
        Long catId = saved.getCategory().getId();
        List<Client> toNotify = demandeRepository.findClientsRequestingCategory(catId);
        String title = "Nouvelle formation: " + saved.getTitle();
        String message = String.format(
                "Une nouvelle formation « %s » démarre le %s. Clôture des inscriptions le %s.",
                saved.getTitle(),
                saved.getDateDebut(),
                saved.getRegistrationEndDate()
        );
        List<Notification> notes = toNotify.stream().map(c -> {
            Notification n = new Notification();
            n.setClient(c);
            n.setType(NotificationType.NEW_COURSE);
            n.setTitle(title);
            n.setMessage(message);
            return n;
        }).toList();
        notificationRepository.saveAll(notes);
        return saved;
    }

    @GetMapping("/search")
    public List<Formation> searchFormations(@RequestParam(required = false) String title) {
        return formationRepository.searchFormations(title);
    }

    @GetMapping
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        Optional<Formation> formation = formationRepository.findById(id);
        return formation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation formationDetails) {
        Optional<Formation> optionalFormation = formationRepository.findById(id);
        if (optionalFormation.isPresent()) {
            Formation formation = optionalFormation.get();
            formation.setName(formationDetails.getName());
            formation.setTitle(formationDetails.getTitle());
            formation.setDescription(formationDetails.getDescription());
            formation.setDateDebut(formationDetails.getDateDebut());
            formation.setDateFin(formationDetails.getDateFin());
            return ResponseEntity.ok(formationRepository.save(formation));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        if (formationRepository.existsById(id)) {
            formationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> likeFormation(@PathVariable Long id) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Formation> formationOpt = formationRepository.findById(id);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Assuming a like mechanism (e.g., add to Client.interested)
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Client client = clientOpt.get();
        client.getInterested().add(formationOpt.get());
        clientRepository.save(client);
        return ResponseEntity.ok("Formation liked successfully");
    }
}