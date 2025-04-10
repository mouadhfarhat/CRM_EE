package com.espritentreprise.user_service.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.espritentreprise.user_service.models.UserRole;
import com.espritentreprise.user_service.models.Client;
import com.espritentreprise.user_service.repositories.ClientRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        client.setRole(UserRole.CLIENT);
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @PostMapping("/{id}/demande")
    public ResponseEntity<?> submitDemande(@PathVariable Long id, @RequestParam Long formationId) {
        Client client = clientRepository.findById(id).orElseThrow();

        // Build payload to send to DemandeService
        Map<String, Object> demandePayload = new HashMap<>();
        demandePayload.put("type", "Inscription");
        demandePayload.put("description", "Demande to join formation " + formationId);
        demandePayload.put("formationId", formationId);
        demandePayload.put("clientId", id); // optional if DemandeService expects it

        String demandeServiceUrl = "http://localhost:8082/demandes/create"; // or use Eureka name like "http://demande-service/demandes/create" if using Eureka with load balancer

        ResponseEntity<String> response = restTemplate.postForEntity(demandeServiceUrl, demandePayload, String.class);

        return ResponseEntity.ok("Demande submitted: " + response.getBody());
    }
}