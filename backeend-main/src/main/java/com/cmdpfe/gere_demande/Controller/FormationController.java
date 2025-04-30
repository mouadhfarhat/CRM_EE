package com.cmdpfe.gere_demande.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cmdpfe.gere_demande.Entity.*;
import com.cmdpfe.gere_demande.Repository.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/formations")
public class FormationController {

    private final FormationRepository formationRepository;
    private final DemandeRepository   demandeRepository;
    private final NotificationRepository notificationRepository;

    public FormationController(FormationRepository formationRepository,
                               DemandeRepository demandeRepository,
                               NotificationRepository notificationRepository) {
        this.formationRepository = formationRepository;
        this.demandeRepository   = demandeRepository;
        this.notificationRepository = notificationRepository;
    }

    
    
    
    //notify the client for a new formation
    
    // Create a new formation + notify clients in that category
    @PostMapping
    public Formation createFormation(@RequestBody Formation formation) {
        Formation saved = formationRepository.save(formation);

        // 1) Fetch all clients who once asked to join this Category
        Long catId = saved.getCategory().getId();
        List<Client> toNotify = demandeRepository.findClientsRequestingCategory(catId);

        // 2) Build notifications
        String title   = "Nouvelle formation: " + saved.getTitle();
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
    
    
    //

    @GetMapping("/search")
    public List<Formation> searchFormations(@RequestParam(required = false) String title) {
        return formationRepository.searchFormations(title);
    }
    
    // Get all formations
    @GetMapping
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    // Get formation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        Optional<Formation> formation = formationRepository.findById(id);
        return formation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

   

    // Update an existing formation
    @PutMapping("/{id}")
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

    // Delete a formation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        if (formationRepository.existsById(id)) {
            formationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
