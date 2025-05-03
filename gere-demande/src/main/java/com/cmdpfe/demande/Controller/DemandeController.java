package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.ClientRepository;
import com.cmdpfe.demande.Repository.DemandeRepository;
import com.cmdpfe.demande.Repository.FormationRepository;
import com.cmdpfe.demande.Repository.GestionnaireRepository;
import com.cmdpfe.demande.Repository.NotificationRepository;
import com.cmdpfe.demande.jwt.CustomJwt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/demandes")
public class DemandeController {

    private final DemandeRepository demandeRepository;
    private final ClientRepository clientRepository;
    private final FormationRepository formationRepository;
    private final GestionnaireRepository gestionnaireRepository;
    private final NotificationRepository notificationRepository;

    private final ConcurrentHashMap<DepartmentType, AtomicInteger> roundRobinCounter = new ConcurrentHashMap<>();

    public DemandeController(DemandeRepository demandeRepository, ClientRepository clientRepository,
                             FormationRepository formationRepository, GestionnaireRepository gestionnaireRepository,
                             NotificationRepository notificationRepository) {
        this.demandeRepository = demandeRepository;
        this.clientRepository = clientRepository;
        this.formationRepository = formationRepository;
        this.gestionnaireRepository = gestionnaireRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/search2")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Client>> searchClientsByFormationAndType(
            @RequestParam("formationId") Long formationId,
            @RequestParam("type") DemandeType type) {
        List<Client> clients = demandeRepository.findClientsByFormationAndTypeAndDoneStatus(formationId, type);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Demande> searchDemandes(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) DemandeStatut statut,
            @RequestParam(required = false) DemandeType type) {
        return demandeRepository.searchDemandes(title, description, clientName, statut, type);
    }

    @GetMapping("/gestionnaire/{gestionnaireId}/search")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public List<Demande> searchDemandesByGestionnaire(
            @PathVariable Long gestionnaireId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) DemandeStatut statut,
            @RequestParam(required = false) DemandeType type) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        // Verify gestionnaireId matches authenticated user
        if (!gestionnaireRepository.findById(gestionnaireId)
                .map(g -> g.getEmail().equals(jwt.getEmail()))
                .orElse(false)) {
            throw new RuntimeException("Unauthorized: Gestionnaire ID does not match authenticated user");
        }
        return demandeRepository.searchByGestionnaire(gestionnaireId, title, description, clientName, statut, type);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Optional<Demande> demande = demandeRepository.findById(id);
        return demande.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/shared-with/{gestionnaireId}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public List<Demande> getDemandesSharedWithGestionnaire(@PathVariable Long gestionnaireId) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        if (!gestionnaireRepository.findById(gestionnaireId)
                .map(g -> g.getEmail().equals(jwt.getEmail()))
                .orElse(false)) {
            throw new RuntimeException("Unauthorized: Gestionnaire ID does not match authenticated user");
        }
        return demandeRepository.findBySharedWithId(gestionnaireId);
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public List<Demande> getDemandesByClient(@PathVariable Long clientId) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        if (!clientRepository.findById(clientId)
                .map(c -> c.getEmail().equals(jwt.getEmail()))
                .orElse(false)) {
            throw new RuntimeException("Unauthorized: Client ID does not match authenticated user");
        }
        return demandeRepository.findByClientId(clientId);
    }

    @GetMapping("/gestionnaire/{gestionnaireId}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public List<Demande> getDemandesByGestionnaire(@PathVariable Long gestionnaireId) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        if (!gestionnaireRepository.findById(gestionnaireId)
                .map(g -> g.getEmail().equals(jwt.getEmail()))
                .orElse(false)) {
            throw new RuntimeException("Unauthorized: Gestionnaire ID does not match authenticated user");
        }
        return demandeRepository.findByGestionnaireAssigneId(gestionnaireId);
    }

    @PutMapping("/{demandeId}/share/{gestionnaireId}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, String>> shareDemandeWithGestionnaire(@PathVariable Long demandeId, @PathVariable Long gestionnaireId) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        if (!gestionnaireRepository.findById(gestionnaireId)
                .map(g -> g.getEmail().equals(jwt.getEmail()))
                .orElse(false)) {
            throw new RuntimeException("Unauthorized: Gestionnaire ID does not match authenticated user");
        }
        Optional<Demande> optionalDemande = demandeRepository.findById(demandeId);
        Optional<Gestionnaire> optionalGestionnaire = gestionnaireRepository.findById(gestionnaireId);

        Map<String, String> response = new HashMap<>();

        if (optionalDemande.isPresent() && optionalGestionnaire.isPresent()) {
            Demande demande = optionalDemande.get();
            Gestionnaire friend = optionalGestionnaire.get();

            demande.setSharedWith(friend);
            demandeRepository.save(demande);

            response.put("message", "Demande shared with Gestionnaire ID: " + gestionnaireId);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Demande or Gestionnaire not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{demandeId}/status")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, Object>> updateDemandeStatus(
            @PathVariable Long demandeId,
            @RequestParam DemandeStatut newStatus,
            @RequestParam Long gestionnaireId) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        if (!gestionnaireRepository.findById(gestionnaireId)
                .map(g -> g.getEmail().equals(jwt.getEmail()))
                .orElse(false)) {
            throw new RuntimeException("Unauthorized: Gestionnaire ID does not match authenticated user");
        }
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);

        if (demandeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Demande not found"));
        }

        Demande demande = demandeOptional.get();

        if (!demande.getGestionnaireAssigne().getId().equals(gestionnaireId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not assigned to this demande"));
        }

        demande.setStatut(newStatus);
        demandeRepository.save(demande);

        Notification notification = new Notification();
        notification.setClient(demande.getClient());
        notification.setTitle("Votre demande a été mise à jour");
        notification.setMessage("Le statut de votre demande \"" + demande.getTitle() + "\" est maintenant : " + newStatus);
        notification.setType(NotificationType.STATUS_UPDATE);
        notificationRepository.save(notification);

        if (newStatus == DemandeStatut.TERMINE) {
            Notification ratingRequest = new Notification();
            ratingRequest.setClient(demande.getClient());
            ratingRequest.setTitle("Évaluez notre service");
            ratingRequest.setMessage("Merci ! Veuillez évaluer votre expérience avec cette demande.");
            ratingRequest.setType(NotificationType.RATING_REQUEST);
            notificationRepository.save(ratingRequest);
        }

        return ResponseEntity.ok(
            Map.of(
                "message", "Demande status updated and notification sent",
                "demandeId", demandeId,
                "newStatus", newStatus.toString()
            )
        );
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('CLIENT')")
    public Demande createDemande(@RequestBody Demande demandeRequest) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Client> clientOpt = clientRepository.findById(demandeRequest.getClient().getId());
        Optional<Formation> formationOpt = formationRepository.findById(demandeRequest.getFormation().getId());

        if (clientOpt.isEmpty() || formationOpt.isEmpty()) {
            throw new RuntimeException("Client or Formation not found");
        }

        // Verify client matches authenticated user
        if (!clientOpt.get().getEmail().equals(jwt.getEmail())) {
            throw new RuntimeException("Unauthorized: Client ID does not match authenticated user");
        }

        DepartmentType departmentType = mapDemandeTypeToDepartmentType(demandeRequest.getType());
        List<Gestionnaire> gestionnaires = gestionnaireRepository.findByDepartment(departmentType);

        if (gestionnaires.isEmpty()) {
            throw new RuntimeException("No Gestionnaire available for this type of demande");
        }

        int index = roundRobinCounter
                .computeIfAbsent(departmentType, k -> new AtomicInteger(0))
                .getAndIncrement() % gestionnaires.size();
        Gestionnaire assignedGestionnaire = gestionnaires.get(index);

        Demande newDemande = new Demande(
                demandeRequest.getTitle(),
                demandeRequest.getDescription(),
                demandeRequest.getType(),
                DemandeStatut.EN_COURS,
                clientOpt.get(),
                formationOpt.get(),
                assignedGestionnaire
        );

        return demandeRepository.save(newDemande);
    }

    private DepartmentType mapDemandeTypeToDepartmentType(DemandeType demandeType) {
        switch (demandeType) {
            case REJOINDRE:
                return DepartmentType.REJOINDRE;
            case ADMINISTRATIVE:
                return DepartmentType.ADMINISTRATIVE;
            case RECLAMATION:
                return DepartmentType.RECLAMATION;
            default:
                throw new IllegalArgumentException("Unknown demande type");
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Demande updateDemandeStatus(@PathVariable Long id, @RequestBody Demande demandeUpdate) {
        return demandeRepository.findById(id).map(demande -> {
            demande.setStatut(demandeUpdate.getStatut());
            return demandeRepository.save(demande);
        }).orElseThrow(() -> new RuntimeException("Demande not found"));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteDemande(@PathVariable Long id) {
        demandeRepository.deleteById(id);
        return "Demande deleted successfully";
    }
}