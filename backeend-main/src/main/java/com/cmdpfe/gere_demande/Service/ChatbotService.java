package com.cmdpfe.gere_demande.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.entity.StringEntity;
import org.apache.http.util.EntityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cmdpfe.gere_demande.Repository.FormationRepository;
import com.cmdpfe.gere_demande.Repository.CategoryRepository;
import com.cmdpfe.gere_demande.Entity.Category;
import com.cmdpfe.gere_demande.Entity.Formation;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);
    
    @Value("${rapidapi.key}")
    private String rapidApiKey;
    
    @Value("${rapidapi.host}")
    private String apiHost;
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Common navigation paths and responses
    private final Map<String, String> navigationPaths = new HashMap<>();
    
    public ChatbotService() {
        // Initialize navigation paths based on your website structure
        initializeNavigationPaths();
    }
    
    private void initializeNavigationPaths() {
        // Add your actual website paths here
        navigationPaths.put("login", "/auth/login");
        navigationPaths.put("register", "/auth/register");
        navigationPaths.put("formations", "/formations");
        navigationPaths.put("contact", "/contact");
        navigationPaths.put("profile", "/profile");
        navigationPaths.put("help", "/help");
        navigationPaths.put("calendar", "/calendar");
        navigationPaths.put("dashboard", "/dashboard");
        navigationPaths.put("clients", "/clients");
        navigationPaths.put("formateurs", "/formateurs");
        // Add more paths as needed
    }
    
    public String getChatbotResponse(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Please provide a message to get a response.";
        }

        // First check if it's a navigation request
        String navigationResponse = checkNavigationRequest(userMessage);
        if (navigationResponse != null) {
            return navigationResponse;
        }
        
        // Then check if it's a database query
        String databaseResponse = checkDatabaseQuery(userMessage);
        if (databaseResponse != null) {
            return databaseResponse;
        }
        
        // If not handled locally, use the external API
        return getExternalChatbotResponse(userMessage);
    }
    
    private String checkNavigationRequest(String userMessage) {
        String lowerCaseMessage = userMessage.toLowerCase();
        
        // Check for navigation keywords
        for (Map.Entry<String, String> entry : navigationPaths.entrySet()) {
            if (lowerCaseMessage.contains("how to " + entry.getKey()) || 
                lowerCaseMessage.contains("where is " + entry.getKey()) ||
                lowerCaseMessage.contains("find " + entry.getKey()) ||
                lowerCaseMessage.contains("go to " + entry.getKey()) ||
                lowerCaseMessage.contains("access " + entry.getKey())) {
                
                String url = baseUrl + entry.getValue();
                return "You can access " + entry.getKey() + " at: " + url;
            }
        }
        
        // Check for more complex navigation requests
        if (lowerCaseMessage.contains("how to use") || 
            lowerCaseMessage.contains("can't figure out") ||
            lowerCaseMessage.contains("help me navigate")) {
            
            return "Our website is designed to be intuitive. You can find our user guide at: " 
                  + baseUrl + "/help/user-guide. For specific features, please ask me about "
                  + "the particular section you need help with.";
        }
        
        // Handle login problems
        if (lowerCaseMessage.contains("login problem") || 
            lowerCaseMessage.contains("can't login") || 
            lowerCaseMessage.contains("forgot password")) {
            
            return "If you're having trouble logging in, you can:\n\n" +
                   "1. Reset your password at: " + baseUrl + "/auth/reset-password\n" +
                   "2. Contact our support team at: support@espritentreprise.com\n" +
                   "3. Check our FAQ at: " + baseUrl + "/help/faq";
        }
        
        return null;
    }
    
    private String checkDatabaseQuery(String userMessage) {
        String lowerCaseMessage = userMessage.toLowerCase();
        
        // Check for formation category queries
        if ((lowerCaseMessage.contains("formation") || lowerCaseMessage.contains("course") || 
             lowerCaseMessage.contains("training")) && 
            (lowerCaseMessage.contains("category") || lowerCaseMessage.contains("in"))) {
            
            // Extract category name from the message
            String category = extractCategory(lowerCaseMessage);
            if (category != null) {
                // Call repository method to find formations by category
                List<String> formations = formationRepository.findNamesByCategory(category);
                return formatFormationResponse(category, formations);
            }
        }
        
        // Check for available categories
        if (lowerCaseMessage.contains("what categories") || 
            lowerCaseMessage.contains("which categories") || 
            lowerCaseMessage.contains("list categories") ||
            lowerCaseMessage.contains("available categories")) {
            
            List<Category> categories = categoryRepository.findAll();
            return formatCategoriesResponse(categories);
        }
        
        // Check for course availability
        if ((lowerCaseMessage.contains("course") || lowerCaseMessage.contains("formation")) && 
            (lowerCaseMessage.contains("available") || lowerCaseMessage.contains("exist"))) {
            
            String courseName = extractCourseName(lowerCaseMessage);
            if (courseName != null) {
                // Check if the course exists in your database
                boolean exists = formationRepository.existsByNameContainingIgnoreCase(courseName);
                
                return exists ? 
                    "Yes, we offer the course '" + courseName + "'. You can view details at: " 
                    + baseUrl + "/formations/" + courseName.replaceAll("\\s+", "-").toLowerCase() :
                    "Currently we don't offer any course named '" + courseName + "'. Browse our available courses at: " 
                    + baseUrl + "/formations";
            }
        }
        
        // Add more database queries as needed for your specific application
        
        return null;
    }
    
    private String formatCategoriesResponse(List<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return "We currently don't have any categories defined in our system.";
        }
        
        StringBuilder response = new StringBuilder();
        response.append("We offer formations in the following categories:\n\n");
        
        for (int i = 0; i < categories.size(); i++) {
            String categoryName = categories.get(i).getName();
            String categoryUrl = baseUrl + "/formations?category=" + categoryName.replaceAll("\\s+", "-").toLowerCase();
            response.append(i + 1).append(". ").append(categoryName).append(" - ").append(categoryUrl).append("\n");
        }
        
        response.append("\nYou can browse all formations at: ").append(baseUrl).append("/formations");
        return response.toString();
    }
    
    private String extractCategory(String message) {
        // First, try to find exact category matches from the database
        List<Category> allCategories = categoryRepository.findAll();
        for (Category category : allCategories) {
            if (message.toLowerCase().contains(category.getName().toLowerCase())) {
                return category.getName();
            }
        }
        
        // Then try to extract category from patterns like "category X", "in X", etc.
        String[] patterns = {"category", "in the", "related to", "about", "in "};
        for (String pattern : patterns) {
            int index = message.toLowerCase().indexOf(pattern);
            if (index != -1) {
                int start = index + pattern.length();
                if (start < message.length()) {
                    String remaining = message.substring(start).trim();
                    String[] words = remaining.split("\\s+");
                    if (words.length > 0) {
                        // Remove punctuation and try to match with a category
                        String potentialCategory = words[0].replaceAll("[?.,]", "");
                        
                        // Try to find a partial match in the database
                        List<Category> matchingCategories = categoryRepository.findByNameContainingIgnoreCase(potentialCategory);
                        if (!matchingCategories.isEmpty()) {
                            return matchingCategories.get(0).getName();
                        }
                        
                        return potentialCategory;
                    }
                }
            }
        }
        
        return null;
    }
    
    private String extractCourseName(String message) {
        // Keywords that might precede a course name
        String[] courseKeywords = {"course named", "course called", "formation named", "formation called", "about"};
        
        for (String keyword : courseKeywords) {
            int index = message.toLowerCase().indexOf(keyword);
            if (index != -1) {
                String remaining = message.substring(index + keyword.length()).trim();
                String[] words = remaining.split("\\s+");
                if (words.length > 0) {
                    // Take up to 3 words as the course name
                    StringBuilder courseName = new StringBuilder();
                    for (int i = 0; i < Math.min(3, words.length); i++) {
                        courseName.append(words[i].replaceAll("[?.,']", "")).append(" ");
                    }
                    return courseName.toString().trim();
                }
            }
        }
        
        return null;
    }
    
    private String formatFormationResponse(String category, List<String> formations) {
        if (formations == null || formations.isEmpty()) {
            return "We currently don't have any formations in the " + category + " category. " +
                   "Browse our available courses at: " + baseUrl + "/formations";
        }
        
        StringBuilder response = new StringBuilder();
        response.append("We have the following formations in the ").append(category).append(" category:\n\n");
        
        for (int i = 0; i < formations.size(); i++) {
            String formationName = formations.get(i);
            String formationUrl = baseUrl + "/formations/" + formationName.replaceAll("\\s+", "-").toLowerCase();
            response.append(i + 1).append(". ").append(formationName).append(" - ").append(formationUrl).append("\n");
        }
        
        response.append("\nYou can browse all formations at: ").append(baseUrl).append("/formations");
        return response.toString();
    }
    
    // External API call method
    private String getExternalChatbotResponse(String userMessage) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost("https://chatgpt-42.p.rapidapi.com/aitohuman");
            
            post.setHeader("Content-Type", "application/json");
            post.setHeader("x-rapidapi-host", apiHost);
            post.setHeader("x-rapidapi-key", rapidApiKey);

            // Enhance the message with context about your CRM system
            String contextualizedMessage = 
                "You are a helpful assistant for 'CRM pour Esprit Entreprise', a CRM system focused on " +
                "managing business formation courses. Answer the following query related to our system: " + 
                userMessage;
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("text", contextualizedMessage);
            
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            post.setEntity(new StringEntity(jsonBody, StandardCharsets.UTF_8));

            logger.debug("Sending request to API: {}", jsonBody);
            
            CloseableHttpResponse response = client.execute(post);
            int statusCode = response.getStatusLine().getStatusCode();
            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
            
            logger.debug("API Response status: {}", statusCode);
            logger.debug("API Response body: {}", responseBody);
            
            if (statusCode >= 200 && statusCode < 300) {
                return parseResponse(responseBody);
            } else {
                logger.error("API error: Status code {}, Response: {}", statusCode, responseBody);
                return "I'm having trouble connecting to my knowledge base. Please try again later or contact support.";
            }
        } catch (Exception e) {
            logger.error("Error communicating with API", e);
            return "I'm having trouble processing your request right now. Please try again later.";
        }
    }
    
    private String parseResponse(String responseBody) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            
            if (rootNode.has("result") && rootNode.has("status") && rootNode.get("status").asBoolean()) {
                JsonNode resultArray = rootNode.get("result");
                
                if (resultArray.isArray() && resultArray.size() > 0) {
                    String text = resultArray.get(0).asText();
                    // Clean up the text
                    String cleanedText = text.trim().replaceAll("\\\\n", " ").replaceAll("^\"|\"$", "");
                    
                    // Add a website-specific call to action when appropriate
                    if (!cleanedText.contains(baseUrl)) {
                        cleanedText += "\n\nIf you need more specific information, you can explore our website or ask me more specific questions.";
                    }
                    
                    return cleanedText;
                }
            }
            
            return "I received a response but couldn't extract useful information. Please try rephrasing your question.";
        } catch (Exception e) {
            logger.error("Error parsing response JSON", e);
            return "I received a response but couldn't process it properly. Please try again.";
        }
    }
}