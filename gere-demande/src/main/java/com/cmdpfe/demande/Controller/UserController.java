package com.cmdpfe.demande.Controller;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.Optional;

import jakarta.annotation.PostConstruct;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Entity.User;
import com.cmdpfe.demande.Repository.*;
import com.cmdpfe.demande.Repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final ClientRepository clientRepo;
    private final GestionnaireRepository gestionnaireRepo;
    private final AdminRepository adminRepo;
    private final Path rootLocation = Paths.get("uploads/images/users");

    public UserController(ClientRepository clientRepo,
                          GestionnaireRepository gestionnaireRepo,
                          AdminRepository adminRepo) {
        this.clientRepo = clientRepo;
        this.gestionnaireRepo = gestionnaireRepo;
        this.adminRepo = adminRepo;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Client client = clientRepo.findByKeycloakId(id);
        if (client != null) {
            return ResponseEntity.ok(client);
        }

        Optional<Gestionnaire> gestionnaireOpt = gestionnaireRepo.findByKeycloakId(id);
        if (gestionnaireOpt.isPresent()) {
            return ResponseEntity.ok(gestionnaireOpt.get());
        }

        Admin admin = adminRepo.findByKeycloakId(id);
        if (admin != null) {
            return ResponseEntity.ok(admin);
        }

        return ResponseEntity.notFound().build();
    }




    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize user image folder", e);
        }
    }

    @PutMapping("/{userId}/upload-image")
    public ResponseEntity<?> uploadUserImage(@PathVariable Long userId,
                                             @RequestParam("file") MultipartFile file) {
        try {
            Optional<? extends User> optionalUser =
                clientRepo.findById(userId)
                    .map(c -> (User) c)
                    .or(() -> gestionnaireRepo.findById(userId).map(g -> (User) g))
                    .or(() -> adminRepo.findById(userId).map(a -> (User) a));

            if (optionalUser.isEmpty()) return ResponseEntity.notFound().build();

            User user = optionalUser.get();
            String filename = "user_" + userId + "_" + System.currentTimeMillis() + ".jpg";
            Path destination = rootLocation.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/images/users/" + filename;
            user.setImageUrl(imageUrl);

            if (user instanceof Client) clientRepo.save((Client) user);
            else if (user instanceof Gestionnaire) gestionnaireRepo.save((Gestionnaire) user);
            else if (user instanceof Admin) adminRepo.save((Admin) user);

            return ResponseEntity.ok(Map.of("imageUrl", imageUrl)); // ✅ Return new image URL

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload image."));
        }
    }
    
    

}
