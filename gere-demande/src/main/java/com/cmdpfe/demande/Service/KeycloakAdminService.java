package com.cmdpfe.demande.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class KeycloakAdminService {

    public String getAdminAccessToken() {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");
        body.add("client_id", "admin-updater-client");
        body.add("client_secret", "tBM4zeisN0GZYpAJWo7CaZpgHEPDZIxf");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "http://localhost:8090/realms/crm/protocol/openid-connect/token",
            request,
            Map.class
        );

        return (String) response.getBody().get("access_token");
    }
}
