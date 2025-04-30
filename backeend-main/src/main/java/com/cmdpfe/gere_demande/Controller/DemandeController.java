package com.cmdpfe.gere_demande.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cmdpfe.gere_demande.Entity.*;
import com.cmdpfe.gere_demande.Repository.ClientRepository;
import com.cmdpfe.gere_demande.Repository.DemandeRepository;
import com.cmdpfe.gere_demande.Repository.FormationRepository;
import com.cmdpfe.gere_demande.Repository.GestionnaireRepository;
import com.cmdpfe.gere_demande.Repository.NotificationRepository;

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


    // Round-robin tracking
    private final ConcurrentHashMap<DepartmentType, AtomicInteger> roundRobinCounter = new ConcurrentHashMap<>();

    public DemandeController(DemandeRepository demandeRepository, ClientRepository clientRepository, 
                             FormationRepository formationRepository, GestionnaireRepository gestionnaireRepository,NotificationRepository notificationRepository) {
        this.demandeRepository = demandeRepository;
        this.clientRepository = clientRepository;
        this.formationRepository = formationRepository;
        this.gestionnaireRepository = gestionnaireRepository;
        this.notificationRepository = notificationRepository;
    }
    
    
    //search for the client with the demande =done,the formation that send to it etc 
    @GetMapping("/search2")
    public ResponseEntity<List<Client>> searchClientsByFormationAndType(
        @RequestParam("formationId") Long formationId,
        @RequestParam("type") DemandeType type
    ) {
        List<Client> clients = demandeRepository.findClientsByFormationAndTypeAndDoneStatus(formationId, type);
        return ResponseEntity.ok(clients);
    }
    
    //search for all type of demande 
    @GetMapping("/search")
    public List<Demande> searchDemandes(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) DemandeStatut statut,
            @RequestParam(required = false) DemandeType type
    ) {
        return demandeRepository.searchDemandes(title, description, clientName, statut, type);
    }
    
    //search 
    @GetMapping("/gestionnaire/{gestionnaireId}/search")
    public List<Demande> searchDemandesByGestionnaire(
            @PathVariable Long gestionnaireId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) DemandeStatut statut,
            @RequestParam(required = false) DemandeType type
    ) {
        return demandeRepository.searchByGestionnaire(
            gestionnaireId,
            title, 
            description,
            clientName,
            statut,
            type
        );
    }


    // Get all demandes
    @GetMapping("/all")
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }
    
    //get the demande by id 
    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Optional<Demande> demande = demandeRepository.findById(id);
        return demande.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    //shared Gestionnaire to list demandes shared with them
    @GetMapping("/shared-with/{gestionnaireId}")
    public List<Demande> getDemandesSharedWithGestionnaire(@PathVariable Long gestionnaireId) {
        return demandeRepository.findBySharedWithId(gestionnaireId);
    }


    // Get demandes for a specific client
    @GetMapping("/client/{clientId}")
    public List<Demande> getDemandesByClient(@PathVariable Long clientId) {
        return demandeRepository.findByClientId(clientId);
    }

    // Get demandes assigned to a specific gestionnaire
    @GetMapping("/gestionnaire/{gestionnaireId}")
    public List<Demande> getDemandesByGestionnaire(@PathVariable Long gestionnaireId) {
        return demandeRepository.findByGestionnaireAssigneId(gestionnaireId);
    }
    
    
    
    @PutMapping("/{demandeId}/share/{gestionnaireId}")
    public ResponseEntity<Map<String, String>> shareDemandeWithGestionnaire(@PathVariable Long demandeId, @PathVariable Long gestionnaireId) {
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


    
    //change status
    @PutMapping("/{demandeId}/status")
    public ResponseEntity<Map<String, Object>> updateDemandeStatus(
            @PathVariable Long demandeId,
            @RequestParam DemandeStatut newStatus,
            @RequestParam Long gestionnaireId) {

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

        // Create and save a notification
        Notification notification = new Notification();
        notification.setClient(demande.getClient());
        notification.setTitle("Votre demande a été mise à jour");
        notification.setMessage("Le statut de votre demande \"" + demande.getTitle() + "\" est maintenant : " + newStatus);
        notification.setType(NotificationType.STATUS_UPDATE);
        notificationRepository.save(notification);

        // If status is TERMINE, send a rating request too
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

 // Create a new demande
    @PostMapping("/create")
    public Demande createDemande(@RequestBody Demande demandeRequest) {
        Optional<Client> clientOpt = clientRepository.findById(demandeRequest.getClient().getId());
        Optional<Formation> formationOpt = formationRepository.findById(demandeRequest.getFormation().getId());

        if (clientOpt.isEmpty() || formationOpt.isEmpty()) {
            throw new RuntimeException("Client or Formation not found");
        }

        // Map DemandeType to DepartmentType
        DepartmentType departmentType = mapDemandeTypeToDepartmentType(demandeRequest.getType());

        
        // Get gestionnaires based on department type
        List<Gestionnaire> gestionnaires = gestionnaireRepository.findByDepartment(departmentType);

        if (gestionnaires.isEmpty()) {
            throw new RuntimeException("No Gestionnaire available for this type of demande");
        }

        // Get next Gestionnaire in round-robin fashion
        int index = roundRobinCounter
                .computeIfAbsent(departmentType, k -> new AtomicInteger(0))
                
                .getAndIncrement() % gestionnaires.size();
        Gestionnaire assignedGestionnaire = gestionnaires.get(index);

        // Save demande with assigned Gestionnaire
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

    // Helper method to map DemandeType to DepartmentType
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


    // Update demande status
    @PutMapping("/update/{id}")
    public Demande updateDemandeStatus(@PathVariable Long id, @RequestBody Demande demandeUpdate) {
        return demandeRepository.findById(id).map(demande -> {
            demande.setStatut(demandeUpdate.getStatut());
            return demandeRepository.save(demande);
        }).orElseThrow(() -> new RuntimeException("Demande not found"));
    }

    // Delete a demande
    @DeleteMapping("/delete/{id}")
    public String deleteDemande(@PathVariable Long id) {
        demandeRepository.deleteById(id);
        return "Demande deleted successfully";
    }
    

}
