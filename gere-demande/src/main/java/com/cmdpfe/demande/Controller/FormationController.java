package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;
import com.cmdpfe.demande.jwt.CustomJwt;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/formations")
public class FormationController {

    private final FormationRepository formationRepository;
    private final DemandeRepository demandeRepository;
    private final NotificationRepository notificationRepository;
    private final ClientRepository clientRepository;
    private final ClientGroupRepository clientGroupRepository;
    private final RatingRepository ratingRepository;
    private final String imageUploadDir = "./uploads/images/";
    private final String fileUploadDir = "./uploads/files/"; // For PDFs

    public FormationController(FormationRepository formationRepository,
                               DemandeRepository demandeRepository,
                               NotificationRepository notificationRepository,
                               ClientRepository clientRepository,
                               ClientGroupRepository clientGroupRepository,
                               RatingRepository ratingRepository) {
        this.formationRepository = formationRepository;
        this.demandeRepository = demandeRepository;
        this.notificationRepository = notificationRepository;
        this.clientRepository = clientRepository;
        this.clientGroupRepository = clientGroupRepository;
        this.ratingRepository = ratingRepository;
        try {
            Files.createDirectories(Paths.get(imageUploadDir));
            Files.createDirectories(Paths.get(fileUploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories!", e);
        }
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Formation> createFormationWithImageAndFile(
            @RequestPart("formation") Formation formation,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @RequestPart(value = "file", required = false) MultipartFile pdfFile) throws IOException {
        // Ensure the ID is null for new formations to avoid conflicts
        formation.setId(null);

        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(imageUploadDir + fileName);
            Files.write(filePath, imageFile.getBytes());
            formation.setImagePath(fileName);
        }

        // Handle PDF upload
        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfFileName = System.currentTimeMillis() + "_" + pdfFile.getOriginalFilename();
            Path pdfPath = Paths.get(fileUploadDir + pdfFileName);
            Files.write(pdfPath, pdfFile.getBytes());
            formation.setFileName(pdfFileName);
        }

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
        return ResponseEntity.ok(saved);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Formation> updateFormationWithImageAndFile(
            @PathVariable Long id,
            @RequestPart("formation") Formation formationDetails,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @RequestPart(value = "file", required = false) MultipartFile pdfFile) throws IOException {
        Optional<Formation> optionalFormation = formationRepository.findById(id);
        if (optionalFormation.isPresent()) {
            Formation formation = optionalFormation.get();

            formation.setName(formationDetails.getName());
            formation.setTitle(formationDetails.getTitle());
            formation.setDescription(formationDetails.getDescription());
            formation.setDateDebut(formationDetails.getDateDebut());
            formation.setDateFin(formationDetails.getDateFin());
            formation.setRegistrationEndDate(formationDetails.getRegistrationEndDate());
            formation.setAverageRating(formationDetails.getAverageRating());
            formation.setPrice(formationDetails.getPrice());
            formation.setCategory(formationDetails.getCategory());
            formation.setFormateur(formationDetails.getFormateur());
            formation.setFoodCompany(formationDetails.getFoodCompany());

            // Handle image update
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filePath = Paths.get(imageUploadDir + fileName);
                Files.write(filePath, imageFile.getBytes());
                if (formation.getImagePath() != null) {
                    Files.deleteIfExists(Paths.get(imageUploadDir + formation.getImagePath()));
                }
                formation.setImagePath(fileName);
            }

            // Handle PDF update
            if (pdfFile != null && !pdfFile.isEmpty()) {
                String pdfFileName = System.currentTimeMillis() + "_" + pdfFile.getOriginalFilename();
                Path pdfPath = Paths.get(fileUploadDir + pdfFileName);
                Files.write(pdfPath, pdfFile.getBytes());
                if (formation.getFileName() != null) {
                    Files.deleteIfExists(Paths.get(fileUploadDir + formation.getFileName()));
                }
                formation.setFileName(pdfFileName);
            }

            return ResponseEntity.ok(formationRepository.save(formation));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get(imageUploadDir + fileName);
        if (Files.exists(filePath)) {
            byte[] image = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg")
                    .body(image);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/files/{fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get(fileUploadDir + fileName);
        if (Files.exists(filePath)) {
            byte[] file = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                    .body(file);
        }
        return ResponseEntity.notFound().build();
    }

    @Transactional
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) throws IOException {
        Optional<Formation> optionalFormation = formationRepository.findById(id);
        if (optionalFormation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Formation formation = optionalFormation.get();

        for (Rating rating : formation.getRatings()) {
            rating.setFormation(null);
            ratingRepository.delete(rating);
        }
        formation.getRatings().clear();

        for (Client client : formation.getInterestedClients()) {
            client.getInterested().remove(formation);
        }

        for (CalendrierEvent event : formation.getEvents()) {
            event.setFormation(null);
        }

        for (Demande demande : formation.getDemanded()) {
            demande.setFormation(null);
            demandeRepository.delete(demande);
        }

        for (ClientGroup group : formation.getGroups()) {
            group.getClients().clear();
            for (CalendrierEvent event : group.getEvents()) {
                event.getGroups().remove(group);
            }
            group.getEvents().clear();
            clientGroupRepository.delete(group);
        }

        if (formation.getImagePath() != null) {
            Files.deleteIfExists(Paths.get(imageUploadDir + formation.getImagePath()));
        }

        if (formation.getFileName() != null) {
            Files.deleteIfExists(Paths.get(fileUploadDir + formation.getFileName()));
        }

        formation.getGroups().clear();
        formation.getDemanded().clear();
        formation.getEvents().clear();
        formation.getInterestedClients().clear();

        formationRepository.delete(formation);
        return ResponseEntity.noContent().build();
    }

    // Other methods remain unchanged...
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

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> likeFormation(@PathVariable Long id) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Formation> formationOpt = formationRepository.findById(id);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Client client = clientOpt.get();
        client.getInterested().add(formationOpt.get());
        clientRepository.save(client);
        return ResponseEntity.ok("Formation liked successfully");
    }

    @GetMapping("/{id}/clients/count")
    public ResponseEntity<Long> countClientsInFormation(@PathVariable Long id) {
        long cnt = clientRepository.countByFormationId(id);
        return ResponseEntity.ok(cnt);
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Integer>> getFormationStats(@PathVariable Long id) {
        int groupCount = formationRepository.countGroupsByFormationId(id);
        int demandeClientCount = formationRepository.countDemandeClientsByFormationId(id);

        Map<String, Integer> stats = new HashMap<>();
        stats.put("groupCount", groupCount);
        stats.put("demandeClientCount", demandeClientCount);

        return ResponseEntity.ok(stats);
    }
    
    
    
    
    @PostMapping("/{id}/interest")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Map<String, String>> markInterestInFormation(@PathVariable Long id) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Formation> formationOpt = formationRepository.findById(id);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Client client = clientOpt.get();
        Formation formation = formationOpt.get();

        if (!client.getInterested().contains(formation)) {
            client.getInterested().add(formation);
            clientRepository.save(client);

            Demande demande = new Demande();
            demande.setClient(client);
            demande.setFormation(formation);
            demande.setType(DemandeType.REJOINDRE);
            demandeRepository.save(demande);

            Notification notification = new Notification();
            notification.setClient(client);
            notification.setType(NotificationType.INTEREST_CONFIRMATION);
            notification.setTitle("Intérêt enregistré pour la formation");
            notification.setMessage(String.format(
                    "Vous avez marqué un intérêt pour la formation « %s ». Vous serez notifié des nouvelles formations dans cette catégorie.",
                    formation.getTitle()
            ));
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return ResponseEntity.ok(Map.of("message", "Interest in formation and category registered successfully"));
    }
    
    @DeleteMapping("/{id}/interest")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Map<String, String>> unmarkInterestInFormation(@PathVariable Long id) {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Optional<Formation> formationOpt = formationRepository.findById(id);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Optional<Client> clientOpt = Optional.ofNullable(clientRepository.findByEmail(jwt.getEmail()));
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Client client = clientOpt.get();
        Formation formation = formationOpt.get();

        if (client.getInterested().contains(formation)) {
            client.getInterested().remove(formation);
            clientRepository.save(client);
            return ResponseEntity.ok(Map.of("message","Interest removed from formation"));
        }

        return ResponseEntity.ok(Map.of("message", "Interest removed from formation"));
    }
    
    @GetMapping("/interested")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Long>> getInterestedFormationIds() {
        CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
        Client client = clientRepository.findByEmail(jwt.getEmail());
        if (client == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<Long> ids = client.getInterested().stream().map(Formation::getId).toList();
        return ResponseEntity.ok(ids);
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<Formation>> getFormationsByCategory(@PathVariable Long categoryId) {
        List<Formation> formations = formationRepository.findByCategoryId(categoryId);
        return ResponseEntity.ok(formations);
    }


}