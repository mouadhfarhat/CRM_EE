package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;
import com.cmdpfe.demande.Service.KeycloakAdminService;
import com.cmdpfe.demande.jwt.CustomJwt;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class UserSyncController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserSyncController.class);

    private final String apiKey;
    private final ClientRepository clientRepository;
    private final GestionnaireRepository gestionnaireRepository;
    private final AdminRepository adminRepository;
    private final RestTemplate restTemplate;
    private final String keycloakBaseUrl;
    private final KeycloakAdminService keycloakAdminService;

    public UserSyncController(
            @Value("${api-key}") String apiKey,
            @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuerUri,
            ClientRepository clientRepository,
            GestionnaireRepository gestionnaireRepository,
            AdminRepository adminRepository,
            KeycloakAdminService keycloakAdminService

    ) {
        this.apiKey = apiKey;
        this.clientRepository = clientRepository;
        this.gestionnaireRepository = gestionnaireRepository;
        this.adminRepository = adminRepository;
        this.restTemplate = new RestTemplate();
        this.keycloakAdminService = keycloakAdminService;

        // Extract the base URL from the issuer URI (e.g., http://localhost:8090)
        this.keycloakBaseUrl = issuerUri.substring(0, issuerUri.lastIndexOf("/realms"));
    }

    @PostMapping("/sync-user")
    public ResponseEntity<Map<String, String>> syncUser(
            @RequestHeader("X-API-Key") String requestApiKey,
            @RequestBody UserSyncDto dto) {

        if (!apiKey.equals(requestApiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid API key"));
        }

        try {
            switch (dto.getType()) {
                case "client" -> processClient(dto);
                case "gestionnaire" -> processGestionnaire(dto);
                case "admin" -> processAdmin(dto);
                default -> {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid user type"));
                }
            }
            return ResponseEntity.ok(Map.of("message", "User synchronized successfully"));
        } catch (Exception e) {
            logger.error("Error processing user sync", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Error synchronizing user: " + e.getMessage()));
        }
    }

    private void processClient(UserSyncDto dto) {
        Client client = clientRepository.findByKeycloakId(dto.getKeycloakId());
        if (client == null) client = new Client();
        setCommonUserProperties(client, dto);
        clientRepository.save(client);
    }

    private void processGestionnaire(UserSyncDto dto) {
        Optional<Gestionnaire> optional = gestionnaireRepository.findByKeycloakId(dto.getKeycloakId());
        Gestionnaire gestionnaire = optional.orElse(new Gestionnaire());
        setCommonUserProperties(gestionnaire, dto);
        gestionnaire.setDepartment(DepartmentType.valueOf(dto.getDepartment()));
        gestionnaireRepository.save(gestionnaire);
    }

    private void processAdmin(UserSyncDto dto) {
        Admin admin = adminRepository.findByKeycloakId(dto.getKeycloakId());
        if (admin == null) admin = new Admin();
        setCommonUserProperties(admin, dto);
        adminRepository.save(admin);
    }

    private void setCommonUserProperties(User user, UserSyncDto dto) {
        user.setKeycloakId(dto.getKeycloakId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setPhoneNumber(dto.getPhoneNumber());
    }

    @PutMapping("/api/usersk/me")
    public ResponseEntity<Map<String, String>> updateUserProfile(
        Authentication authentication,
        @RequestBody UserUpdateDto dto) {

        if (!(authentication instanceof JwtAuthenticationToken)) {
            logger.error("Authentication is not a JwtAuthenticationToken");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid authentication type"));
        }

        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
        Jwt jwt = jwtAuth.getToken();

        if (jwt == null) {
            logger.error("JWT token is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No JWT token found"));
        }
        
        String keycloakId = jwt.getSubject();
        logger.debug("Processing request for user with keycloakId: {}", keycloakId);

        try {
            Set<String> roles = jwtAuth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
            logger.debug("User roles: {}", roles);

            // Update local database
            boolean localUpdateSuccess = updateLocalDatabase(roles, keycloakId, dto);
            if (!localUpdateSuccess) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found in local database"));
            }
         // Update Keycloak too
            updateKeycloakUser(keycloakId, dto);

   

            // For public clients, we're not updating Keycloak via API
            // This would require admin access which we avoid with public clients
            // Instead, return a clear message to guide the user
            return ResponseEntity.ok(Map.of(
                "message", "User profile updated in local database", 
                "note", "Profile changes must be updated in Keycloak separately"
            ));
        } catch (Exception e) {
            logger.error("Failed to update profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating profile: " + e.getMessage()));
        }
    }

    private boolean updateLocalDatabase(Set<String> roles, String keycloakId, UserUpdateDto dto) {
        if (roles.contains("ROLE_ADMIN")) {
            Admin a = adminRepository.findByKeycloakId(keycloakId);
            if (a != null) {
                updateUserFields(a, dto);
                adminRepository.save(a);
                return true;
            }
        } else if (roles.contains("ROLE_GESTIONNAIRE")) {
            Optional<Gestionnaire> gOpt = gestionnaireRepository.findByKeycloakId(keycloakId);
            if (gOpt.isPresent()) {
                Gestionnaire g = gOpt.get();
                updateUserFields(g, dto);
                gestionnaireRepository.save(g);
                return true;
            }
        } else if (roles.contains("ROLE_CLIENT")) {
            Client c = clientRepository.findByKeycloakId(keycloakId);
            if (c != null) {
                updateUserFields(c, dto);
                clientRepository.save(c);
                return true;
            }
        }
        return false;
    }

    private void updateUserFields(User user, UserUpdateDto dto) {
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
    }
    
    
    public void updateKeycloakUser(String keycloakId, UserUpdateDto dto) {
        String adminToken = keycloakAdminService.getAdminAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        Map<String, Object> payload = Map.of(
            "firstName", dto.getFirstname(),
            "lastName", dto.getLastname(),
            "email", dto.getEmail(),
            "attributes", Map.of("phone_number", List.of(dto.getPhoneNumber()))
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        String url = keycloakBaseUrl + "/admin/realms/crm/users/" + keycloakId;

        restTemplate.put(url, request);
    }



    // Note: We removed the Keycloak admin API methods since we're using a public client

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
        public String getKeycloakId() {
            return keycloakId;
        }
        public void setKeycloakId(String keycloakId) {
            this.keycloakId = keycloakId;
        }
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }
        public String getFirstname() {
            return firstname;
        }
        public void setFirstname(String firstname) {
            this.firstname = firstname;
        }
        public String getLastname() {
            return lastname;
        }
        public void setLastname(String lastname) {
            this.lastname = lastname;
        }
        public String getPhoneNumber() {
            return phoneNumber;
        }
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        public String getType() {
            return type;
        }
        public void setType(String type) {
            this.type = type;
        }
        public String getDepartment() {
            return department;
        }
        public void setDepartment(String department) {
            this.department = department;
        }
    }
    
    public static class UserUpdateDto {
        private String firstname;
        private String lastname;
        private String email;
        private String phoneNumber;

        // Getters and Setters
        public String getFirstname() {
            return firstname;
        }
        public void setFirstname(String firstname) {
            this.firstname = firstname;
        }

        public String getLastname() {
            return lastname;
        }
        public void setLastname(String lastname) {
            this.lastname = lastname;
        }

        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }
}