package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.Client;
import com.cmdpfe.demande.Entity.Notification;
import com.cmdpfe.demande.Repository.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);
    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Client> registerClient(@RequestBody Map<String, Object> userData) {
        String email = (String) userData.get("email");
        if (email == null || email.isEmpty()) {
            logger.error("Email is missing in user data: {}", userData);
            return ResponseEntity.badRequest().body(null);
        }

        if (clientRepository.existsByEmail(email)) {
            logger.warn("User with email {} already exists", email);
            return ResponseEntity.badRequest().body(null);
        }

        Client client = new Client();
        client.setUsername((String) userData.get("username"));
        client.setEmail(email);
        client.setFirstname((String) userData.get("firstname"));
        client.setLastname((String) userData.get("lastname"));
        client.setPhoneNumber((String) userData.getOrDefault("phoneNumber", ""));
        client.setInterested(List.of());

        try {
            Client saved = clientRepository.save(client);
            logger.info("Saved client with email: {}", email);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            logger.error("Error saving client: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Other endpoints remain unchanged
    @GetMapping("/search")
    public List<Client> searchClients(@RequestParam(required = false) String username) {
        // Temporarily return all clients until searchClients is re-added
        return clientRepository.findAll();
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Client> getClientById(@PathVariable Long id) {
        return clientRepository.findById(id);
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setUsername(updatedClient.getUsername());
                    client.setEmail(updatedClient.getEmail());
                    return clientRepository.save(client);
                })
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
    }
    @GetMapping("/by-username/{username}")
    public Long getClientIdByUsername(@PathVariable String username) {
        return clientRepository.findByUsername(username)
                               .map(Client::getId)
                               .orElseThrow(() -> new RuntimeException("Client not found"));
    }
 // In ClientController
    @GetMapping("/by-formation/{formationId}")
    public List<Client> getClientsByFormation(@PathVariable Long formationId) {
        return clientRepository.findByFormationId(formationId);
    }
    
    
    @GetMapping("/interested-in/{formationId}")
    public ResponseEntity<List<Client>> getClientsInterestedInFormation(@PathVariable Long formationId) {
        List<Client> clients = clientRepository.findByFormationId(formationId);
        return ResponseEntity.ok(clients);
    }
    
 // In ClientController
    @GetMapping("/by-group/{groupId}")
    public List<Client> getClientsByGroup(@PathVariable Long groupId) {
        return clientRepository.findByGroupId(groupId);
    }


}