package com.example.keycloak;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RoleModel;
import org.keycloak.models.UserModel;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

public class UserRegistrationEventListenerProvider implements EventListenerProvider {
    private final KeycloakSession session;
    private final String syncEndpoint = "http://host.docker.internal:8080/sync-user";
    private final String apiKey = "7b9f2c4d-8e1a-4b3c-9d5e-f6a7b8c9d0e1"; // Match Spring Boot
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserRegistrationEventListenerProvider(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public void onEvent(Event event) {
        if (event.getType() == EventType.REGISTER || event.getType() == EventType.LOGIN) {
            RealmModel realm = session.realms().getRealm(event.getRealmId());
            UserModel user = session.users().getUserById(realm, event.getUserId());

            if (user != null) {
                // Handle REGISTER: Assign client role
                if (event.getType() == EventType.REGISTER) {
                    RoleModel clientRole = realm.getRole("client");
                    if (clientRole != null && !user.hasRole(clientRole)) {
                        user.grantRole(clientRole);
                    }
                }

                // Determine user type based on roles
                String type = null;
                if (user.hasRole(realm.getRole("ADMIN"))) {
                    type = "admin";
                } else if (user.hasRole(realm.getRole("GESTIONNAIRE"))) {
                    type = "gestionnaire";
                } else if (user.hasRole(realm.getRole("CLIENT"))) {
                    type = "client";
                }

                if (type != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("keycloakId", user.getId());
                    userData.put("username", user.getUsername());
                    userData.put("email", user.getEmail());
                    userData.put("firstname", user.getFirstName());
                    userData.put("lastname", user.getLastName());
                    userData.put("phoneNumber", user.getFirstAttribute("phone_number"));
                    userData.put("type", type);
                    if ("gestionnaire".equals(type)) {
                        userData.put("department", "RECLAMATION");
                    }

                    try {
                        String jsonBody = objectMapper.writeValueAsString(userData);
                        HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create(syncEndpoint))
                                .header("Content-Type", "application/json")
                                .header("X-API-Key", apiKey)
                                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                                .build();
                        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                        if (response.statusCode() == 200) {
                            System.out.println("Synced user: " + user.getEmail());
                        } else {
                            System.err.println("Sync failed: HTTP " + response.statusCode());
                        }
                    } catch (Exception e) {
                        System.err.println("Sync error: " + e.getMessage());
                    }
                }
            }
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean includeRepresentation) {
    }

    @Override
    public void close() {
    }
}