package com.cmdpfe.demande.Controller;


import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
@Profile("test") // Only active in test profile
public class TestController {

    private final ClientRepository clientRepository;
    private final GestionnaireRepository gestionnaireRepository;
    private final AdminRepository adminRepository;

    public TestController(ClientRepository clientRepository,
                         GestionnaireRepository gestionnaireRepository,
                         AdminRepository adminRepository) {
        this.clientRepository = clientRepository;
        this.gestionnaireRepository = gestionnaireRepository;
        this.adminRepository = adminRepository;
    }

    // Create test users for all roles
    @PostMapping("/setup-test-users")
    public ResponseEntity<Map<String, String>> setupTestUsers() {
        try {
            // Create test client
            if (clientRepository.findByKeycloakId("test-client-123") == null) {
                Client client = new Client();
                client.setKeycloakId("test-client-123");
                client.setUsername("testclient");
                client.setEmail("client@test.com");
                client.setFirstname("Test");
                client.setLastname("Client");
                client.setPhoneNumber("1234567890");
                client.setInterested(List.of());
                clientRepository.save(client);
            }

            // Create test gestionnaire
            if (gestionnaireRepository.findByKeycloakId("test-gestionnaire-456").isEmpty()) {
                Gestionnaire gestionnaire = new Gestionnaire();
                gestionnaire.setKeycloakId("test-gestionnaire-456");
                gestionnaire.setUsername("testgestionnaire");
                gestionnaire.setEmail("gestionnaire@test.com");
                gestionnaire.setFirstname("Test");
                gestionnaire.setLastname("Gestionnaire");
                gestionnaire.setPhoneNumber("0987654321");
                gestionnaireRepository.save(gestionnaire);
            }

            // Create test admin
            if (adminRepository.findByKeycloakId("test-admin-789") == null) {
                Admin admin = new Admin();
                admin.setKeycloakId("test-admin-789");
                admin.setUsername("testadmin");
                admin.setEmail("admin@test.com");
                admin.setFirstname("Test");
                admin.setLastname("Admin");
                admin.setPhoneNumber("5555555555");
                adminRepository.save(admin);
            }

            return ResponseEntity.ok(Map.of(
                "message", "Test users created successfully",
                "client", "testclient (ID: test-client-123)",
                "gestionnaire", "testgestionnaire (ID: test-gestionnaire-456)",
                "admin", "testadmin (ID: test-admin-789)"
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to create test users: " + e.getMessage()));
        }
    }

    // Get all test users
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllTestUsers() {
        return ResponseEntity.ok(Map.of(
            "clients", clientRepository.findAll(),
            "gestionnaires", gestionnaireRepository.findAll(),
            "admins", adminRepository.findAll()
        ));
    }

    // Mock login endpoints
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> mockLogin(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String role = loginData.get("role"); // CLIENT, GESTIONNAIRE, or ADMIN

        if (username == null || role == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Username and role are required"));
        }

        // Return mock user data based on role
        Map<String, Object> userData = switch (role.toUpperCase()) {
            case "CLIENT" -> {
                Optional<Client> clientOpt = clientRepository.findByUsername(username);
                if (clientOpt.isPresent()) {
                    Client client = clientOpt.get();
                    yield Map.of(
                        "id", client.getId(),
                        "keycloakId", client.getKeycloakId(),
                        "username", client.getUsername(),
                        "email", client.getEmail(),
                        "role", "CLIENT",
                        "firstname", client.getFirstname(),
                        "lastname", client.getLastname()
                    );
                }
                yield Map.of("error", "Client not found");
            }
            case "GESTIONNAIRE" -> {
                Optional<Gestionnaire> gestionnaireOpt = gestionnaireRepository.findByUsername(username);
                if (gestionnaireOpt.isPresent()) {
                    Gestionnaire g = gestionnaireOpt.get();
                    yield Map.of(
                        "id", g.getId(),
                        "keycloakId", g.getKeycloakId(),
                        "username", g.getUsername(),
                        "email", g.getEmail(),
                        "role", "GESTIONNAIRE",
                        "firstname", g.getFirstname(),
                        "lastname", g.getLastname(),
                        "department", g.getDepartment()
                    );
                }
                yield Map.of("error", "Gestionnaire not found");
            }
            case "ADMIN" -> {
                Optional<Admin> adminOpt = adminRepository.findByUsername(username);
                if (adminOpt.isPresent()) {
                    Admin admin = adminOpt.get();
                    yield Map.of(
                        "id", admin.getId(),
                        "keycloakId", admin.getKeycloakId(),
                        "username", admin.getUsername(),
                        "email", admin.getEmail(),
                        "role", "ADMIN",
                        "firstname", admin.getFirstname(),
                        "lastname", admin.getLastname()
                    );
                }
                yield Map.of("error", "Admin not found");
            }
            default -> Map.of("error", "Invalid role");
        };

        return ResponseEntity.ok(userData);
    }

    // Clear all test data
    @DeleteMapping("/cleanup")
    public ResponseEntity<Map<String, String>> cleanup() {
        try {
            // Only delete test users (those with test keycloak IDs)
            Client client = clientRepository.findByKeycloakId("test-client-123");
            if (client != null) clientRepository.delete(client);

            Optional<Gestionnaire> gestionnaire = gestionnaireRepository.findByKeycloakId("test-gestionnaire-456");
            gestionnaire.ifPresent(gestionnaireRepository::delete);

            Admin admin = adminRepository.findByKeycloakId("test-admin-789");
            if (admin != null) adminRepository.delete(admin);

            return ResponseEntity.ok(Map.of("message", "Test data cleaned up successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to cleanup: " + e.getMessage()));
        }
    }
}