package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserSyncController {

    private static final Logger logger = LoggerFactory.getLogger(UserSyncController.class);

    private final String apiKey;
    private final ClientRepository clientRepository;
    private final GestionnaireRepository gestionnaireRepository;
    private final AdminRepository adminRepository;

    public UserSyncController(
            @Value("${api-key}") String apiKey,
            ClientRepository clientRepository,
            GestionnaireRepository gestionnaireRepository,
            AdminRepository adminRepository
    ) {
        this.apiKey = apiKey;
        this.clientRepository = clientRepository;
        this.gestionnaireRepository = gestionnaireRepository;
        this.adminRepository = adminRepository;
        System.out.println("UserSyncController initialized with API key: " + apiKey);
    }

    @PostMapping("/sync-user")
    public ResponseEntity<Void> syncUser(
            @RequestHeader("X-API-Key") String requestApiKey,
            @RequestBody UserSyncDto dto) {

        logger.debug("Received API Key: {} | Expected API Key: {}", requestApiKey, apiKey);

        if (!apiKey.equals(requestApiKey)) {
            logger.warn("API key validation failed. Received: {} | Expected: {}", requestApiKey, apiKey);
            return ResponseEntity.status(401).build();
        }

        logger.info("Processing user sync for type: {} (Keycloak ID: {})", dto.getType(), dto.getKeycloakId());

        try {
            switch (dto.getType()) {
                case "client":
                    processClient(dto);
                    break;
                case "gestionnaire":
                    processGestionnaire(dto);
                    break;
                case "admin":
                    processAdmin(dto);
                    break;
                default:
                    logger.warn("Invalid user type received: {}", dto.getType());
                    return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error processing user sync", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private void processClient(UserSyncDto dto) {
        if (clientRepository.findByKeycloakId(dto.getKeycloakId()) == null) {
            Client client = new Client();
            setCommonUserProperties(client, dto);
            clientRepository.save(client);
            logger.info("Successfully saved new client: {}", dto.getKeycloakId());
        } else {
            logger.debug("Client already exists: {}", dto.getKeycloakId());
        }
    }

    private void processGestionnaire(UserSyncDto dto) {
        if (gestionnaireRepository.findByKeycloakId(dto.getKeycloakId()) == null) {
            Gestionnaire gestionnaire = new Gestionnaire();
            setCommonUserProperties(gestionnaire, dto);
            gestionnaire.setDepartment(DepartmentType.valueOf(dto.getDepartment()));
            gestionnaireRepository.save(gestionnaire);
            logger.info("Successfully saved new gestionnaire: {}", dto.getKeycloakId());
        } else {
            logger.debug("Gestionnaire already exists: {}", dto.getKeycloakId());
        }
    }

    private void processAdmin(UserSyncDto dto) {
        if (adminRepository.findByKeycloakId(dto.getKeycloakId()) == null) {
            Admin admin = new Admin();
            setCommonUserProperties(admin, dto);
            adminRepository.save(admin);
            logger.info("Successfully saved new admin: {}", dto.getKeycloakId());
        } else {
            logger.debug("Admin already exists: {}", dto.getKeycloakId());
        }
    }

    private void setCommonUserProperties(User user, UserSyncDto dto) {
        user.setKeycloakId(dto.getKeycloakId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setPhoneNumber(dto.getPhoneNumber());
    }

    public static class UserSyncDto {
        private String keycloakId;
        private String username;
        private String email;
        private String firstname;
        private String lastname;
        private String phoneNumber;
        private String type;
        private String department;

        // Getters and setters
        public String getKeycloakId() { return keycloakId; }
        public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstname() { return firstname; }
        public void setFirstname(String firstname) { this.firstname = firstname; }
        public String getLastname() { return lastname; }
        public void setLastname(String lastname) { this.lastname = lastname; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }
}
