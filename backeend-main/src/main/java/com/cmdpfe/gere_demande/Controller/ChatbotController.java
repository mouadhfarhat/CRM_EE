package com.cmdpfe.gere_demande.Controller;

import com.cmdpfe.gere_demande.Entity.ChatRequest;
import com.cmdpfe.gere_demande.Entity.ChatResponse;
import com.cmdpfe.gere_demande.Service.ChatbotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    
    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        logger.info("Received chat request: {}", request.getUserMessage());
        
        try {
            String botResponse = chatbotService.getChatbotResponse(request.getUserMessage());
            ChatResponse response = new ChatResponse(botResponse);
            
            logger.info("Returning chat response");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing chat request", e);
            ChatResponse errorResponse = new ChatResponse("Sorry, I couldn't process your request: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }
}