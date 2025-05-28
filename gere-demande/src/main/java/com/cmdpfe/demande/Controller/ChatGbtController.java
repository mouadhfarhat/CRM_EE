/*package com.cmdpfe.gere_demande.Controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatGbtController {

    @Value("${rapidapi.key:c4ce61e66cmsh093df949f93970dp1167e8jsn5f0ee0024abd}")
    private String rapidApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ChatGbtController() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        try {
            // Prepare the request body for the ChatGPT API
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("chatId", "92d97036-3e25-442b-9a25-096ab45b0525");
            
            List<Map<String, String>> messages = new ArrayList<>();
            
            // System message
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are a virtual assistant. Your name is BalBot and you are a guide to the CRM project developed by a group of 2 skilled IT Engineers (Mouadh Farhat - Haider Bennouri ), which is a cross-platform project that simplifies the management of municipalities in Tunisia, as well as the customer service part, in fact our application is intended for employees and citizens, currently we are still under development, this will focus on the Ariana sector.");
            messages.add(systemMessage);
            
            // User message
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", request.getMessage());
            messages.add(userMessage);
            
            requestBody.put("messages", messages);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Host", "chat-gtp-free.p.rapidapi.com");
            headers.set("X-RapidAPI-Key", rapidApiKey);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make the API request
            ResponseEntity<String> response = restTemplate.exchange(
                "https://chat-gtp-free.p.rapidapi.com/v1/chat/completions",
                HttpMethod.POST,
                entity,
                String.class
            );

            // Parse the response
            JsonNode responseNode = objectMapper.readTree(response.getBody());
            String botResponse = responseNode.has("text") ? responseNode.get("text").asText() : "Sorry, I couldn't process your request.";

            // Prepare the response
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("response", botResponse);
            result.put("userMessage", request.getMessage());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            // Handle errors
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Network error: Unable to connect to the chat server. Please try again later.");
            errorResponse.put("details", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // DTO for request
    public static class ChatRequest {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}*/