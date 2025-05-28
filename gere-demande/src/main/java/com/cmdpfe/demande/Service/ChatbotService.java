package com.cmdpfe.demande.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.cmdpfe.demande.Repository.FormationRepository;
import com.cmdpfe.demande.Repository.CategoryRepository;
import com.cmdpfe.demande.Entity.Category;
import com.cmdpfe.demande.Entity.Formation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    // Messages de salutation et d'aide
    private final Set<String> greetings = Set.of(
        "bonjour", "bonsoir", "salut", "hello", "hey", "hi"
    );
    
    private final Set<String> helpKeywords = Set.of(
        "aide", "help", "aidez-moi", "comment", "que puis-je"
    );

    // Mots-clés pour catégories communes
    private final Map<String, String> categoryKeywords = Map.of(
        "ai", "intelligence artificielle",
        "ia", "intelligence artificielle", 
        "informatique", "informatique",
        "marketing", "marketing",
        "design", "design",
        "business", "business",
        "web", "développement web",
        "digital", "digital",
        "développement", "développement",
        "management", "management"
    );

    public String getChatbotResponse(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Bonjour ! Je suis là pour vous aider avec nos formations. Que souhaitez-vous savoir ?";
        }

        String message = userMessage.toLowerCase().trim();
        
        // Gestion des salutations
        if (containsAny(message, greetings)) {
            return getGreetingResponse();
        }
        
        // Gestion des demandes d'aide
        if (containsAny(message, helpKeywords)) {
            return getHelpResponse();
        }
        
        // Gestion des questions sur les catégories
        String categoryResponse = handleCategoryQuestions(message);
        if (categoryResponse != null) {
            return categoryResponse;
        }
        
        // Gestion des questions sur les formations
        String formationResponse = handleFormationQuestions(message);
        if (formationResponse != null) {
            return formationResponse;
        }
        
        // Gestion des questions générales sur l'entreprise
        String generalResponse = handleGeneralQuestions(message);
        if (generalResponse != null) {
            return generalResponse;
        }
        
        // Message par défaut si aucune correspondance
        return getDefaultResponse();
    }
    
    private String getGreetingResponse() {
        List<String> responses = Arrays.asList(
            "Bonjour ! 👋 Je suis votre assistant pour les formations d'Esprit Entreprise. Comment puis-je vous aider aujourd'hui ?",
            "Salut ! 😊 Je peux vous renseigner sur nos formations et catégories. Que cherchez-vous ?",
            "Hello ! 🎓 Je suis là pour répondre à vos questions sur nos programmes de formation. Que souhaitez-vous savoir ?"
        );
        return responses.get(new Random().nextInt(responses.size()));
    }
    
    private String getHelpResponse() {
        return "🤖 **Je peux vous aider avec :**\n\n" +
               "🎓 **Formations disponibles** - Tapez \"formations\" ou \"liste formations\"\n" +
               "📂 **Catégories** - Tapez \"catégories\" ou \"domaines\"\n" +
               "🔍 **Recherche par domaine** - \"formations en AI\" ou \"formations marketing\"\n" +
               "📋 **Détails formation** - \"détails [nom formation]\"\n" +
               "💰 **Informations pratiques** - \"prix\", \"durée\", \"inscription\"\n\n" +
               "💡 **Exemples de questions :**\n" +
               "• \"Quelles sont les formations en IA ?\"\n" +
               "• \"Montrez-moi toutes les catégories\"\n" +
               "• \"Formations disponibles en marketing\"";
    }
    
    private String handleCategoryQuestions(String message) {
        // Questions sur la liste des catégories
        if (message.contains("catégorie") || message.contains("domaine") || 
            message.contains("secteur") || message.contains("spécialité")) {
            
            if (message.contains("quell") || message.contains("list") || 
                message.contains("disponible") || message.contains("exist") ||
                message.contains("catégories") || message.contains("toutes")) {
                return getCategoriesListResponse();
            }
        }
        
        // Recherche formations par catégorie avec pattern amélioré
        if (isSearchByCategory(message)) {
            String categoryName = extractCategoryFromMessage(message);
            if (categoryName != null) {
                return getFormationsInCategoryResponse(categoryName);
            }
        }
        
        return null;
    }
    
    private boolean isSearchByCategory(String message) {
        // Patterns pour détecter une recherche par catégorie
        String[] categoryPatterns = {
            "formations en ", "formations dans ", "formations de ", 
            "cours en ", "cours dans ", "cours de ",
            "quelles formations en ", "quelles formations dans ",
            "formations category ", "formations catégorie "
        };
        
        for (String pattern : categoryPatterns) {
            if (message.contains(pattern)) {
                return true;
            }
        }
        
        // Vérifier les mots-clés de catégories
        return categoryKeywords.keySet().stream().anyMatch(message::contains);
    }
    
    private String handleFormationQuestions(String message) {
        // Questions générales sur les formations
        if (message.contains("formation") || message.contains("cours") || 
            message.contains("programme") || message.contains("training")) {
            
            // Liste de toutes les formations
            if (message.contains("quell") || message.contains("list") || 
                message.contains("disponible") || message.contains("tout") ||
                message.equals("formations") || message.contains("toutes les formations")) {
                return getAllFormationsResponse();
            }
            
            // Recherche d'une formation spécifique
            String formationName = extractFormationNameFromMessage(message);
            if (formationName != null) {
                return getSpecificFormationResponse(formationName);
            }
        }
        
        // Questions sur les détails pratiques
        return handlePracticalQuestions(message);
    }
    
    private String handlePracticalQuestions(String message) {
        if (message.contains("durée") || message.contains("combien de temps")) {
            return "⏰ **Durée des formations :**\n\n" +
                   "Les durées varient selon le programme choisi.\n\n" +
                   "💡 **Pour connaître la durée exacte :**\n" +
                   "• Précisez-moi quelle formation vous intéresse\n" +
                   "• Consultez les détails sur " + baseUrl + "/formations\n\n" +
                   "🔍 **Quelle formation vous intéresse ?**";
        }
        
        if (message.contains("prix") || message.contains("tarif") || message.contains("coût")) {
            return "💰 **Informations tarifaires :**\n\n" +
                   "Nos formations ont des tarifs adaptés à chaque programme.\n\n" +
                   "📊 **Pour connaître les prix :**\n" +
                   "• Consultez " + baseUrl + "/formations\n" +
                   "• Contactez notre équipe commerciale\n" +
                   "• Demandez un devis personnalisé\n\n" +
                   "💡 **Quelle formation vous intéresse pour le tarif ?**";
        }
        
        if (message.contains("inscri") || message.contains("comment s'inscri")) {
            return "📝 **Inscription simple et rapide :**\n\n" +
                   "**Étapes :**\n" +
                   "1️⃣ Visitez " + baseUrl + "/formations\n" +
                   "2️⃣ Choisissez votre formation\n" +
                   "3️⃣ Cliquez sur \"S'inscrire\"\n" +
                   "4️⃣ Remplissez le formulaire\n" +
                   "5️⃣ Confirmez votre inscription\n\n" +
                   "✅ **Inscription sécurisée en quelques clics !**";
        }
        
        return null;
    }
    
    private String handleGeneralQuestions(String message) {
        if (message.contains("esprit entreprise") || message.contains("votre entreprise") || 
            message.contains("qui êtes-vous") || message.contains("présentation")) {
            return "🏢 **Esprit Entreprise - Formation Professionnelle**\n\n" +
                   "Nous sommes spécialisés dans la formation de qualité.\n\n" +
                   "✨ **Nos points forts :**\n" +
                   "• Large gamme de formations professionnelles\n" +
                   "• Formateurs experts dans leurs domaines\n" +
                   "• Programmes adaptés aux besoins du marché\n" +
                   "• Suivi personnalisé des apprenants\n\n" +
                   "🎓 **Découvrez nos formations dès maintenant !**";
        }
        
        if (message.contains("contact") || message.contains("téléphone") || message.contains("email")) {
            return "📞 **Contactez-nous :**\n\n" +
                   "🌐 **Site web :** " + baseUrl + "\n" +
                   "📧 **Email :** contact@espritentreprise.com\n" +
                   "📍 **Adresse :** [Votre adresse]\n\n" +
                   "⏰ **Horaires :** Lundi-Vendredi 9h-18h\n\n" +
                   "💬 **Comment puis-je vous aider avec nos formations ?**";
        }
        
        return null;
    }
    
    private String getCategoriesListResponse() {
        try {
            List<Category> categories = categoryRepository.findAll();
            
            if (categories.isEmpty()) {
                return "📂 **Catalogue en préparation**\n\n" +
                       "Nos catégories de formations sont en cours de mise à jour.\n\n" +
                       "🔄 Revenez bientôt pour découvrir tous nos domaines !";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("🎯 **Nos domaines de formation :**\n\n");
            
            for (Category category : categories) {
                response.append("📂 **").append(category.getName()).append("**");
                
                // Compter les formations dans cette catégorie
                try {
                    long formationCount = category.getFormations() != null ? 
                        category.getFormations().size() : 
                        formationRepository.findByCategoryId(category.getId()).size();
                    
                    response.append(" (").append(formationCount).append(" formation");
                    if (formationCount > 1) response.append("s");
                    response.append(")\n");
                } catch (Exception e) {
                    response.append("\n");
                }
            }
            
            response.append("\n💡 **Pour voir les formations d'une catégorie :**\n");
            response.append("Tapez \"formations en [nom catégorie]\"\n");
            response.append("Exemple : \"formations en IA\"");
            
            return response.toString();
            
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des catégories", e);
            return "❌ **Problème technique**\n\n" +
                   "Je ne peux pas accéder aux catégories actuellement.\n" +
                   "💡 Réessayez dans quelques instants.";
        }
    }
    
    private String getAllFormationsResponse() {
        try {
            List<Formation> formations = formationRepository.findAll();
            
            if (formations.isEmpty()) {
                return "📚 **Catalogue en préparation**\n\n" +
                       "Notre catalogue de formations est en cours de mise à jour.\n\n" +
                       "🔄 Revenez bientôt pour découvrir tous nos programmes !";
            }
            
            if (formations.size() > 15) {
                return String.format(
                    "📊 **%d formations disponibles** dans notre catalogue !\n\n" +
                    "🔍 **Navigation facilitée :**\n" +
                    "▫️ \"catégories\" - Voir tous les domaines\n" +
                    "▫️ \"formations en [domaine]\" - Recherche ciblée\n" +
                    "▫️ Nom d'une formation - Détails spécifiques\n\n" +
                    "🌐 **Catalogue complet :** %s/formations", 
                    formations.size(), baseUrl);
            }
            
            StringBuilder response = new StringBuilder();
            response.append("📚 **Toutes nos formations :**\n\n");
            
            // Grouper par catégorie si possible
            Map<String, List<Formation>> formationsByCategory = formations.stream()
                .collect(Collectors.groupingBy(f -> 
                    f.getCategory() != null ? f.getCategory().getName() : "Autres"));
            
            for (Map.Entry<String, List<Formation>> entry : formationsByCategory.entrySet()) {
                response.append("📂 **").append(entry.getKey()).append("**\n");
                
                for (Formation formation : entry.getValue()) {
                    String formationName = getFormationDisplayName(formation);
                    response.append("  🎓 ").append(formationName);
                    
                    if (formation.getPrice() != null) {
                        response.append(" - ").append(formation.getPrice()).append("€");
                    }
                    response.append("\n");
                }
                response.append("\n");
            }
            
            response.append("💬 **Besoin de détails ?** Demandez-moi des informations sur une formation !");
            return response.toString();
            
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des formations", e);
            return "❌ **Problème technique**\n\n" +
                   "Je ne peux pas accéder aux formations actuellement.\n" +
                   "💡 Réessayez dans quelques instants.";
        }
    }
    
    private String getFormationsInCategoryResponse(String categoryName) {
        try {
            // Recherche de la catégorie (flexible)
            Category category = findCategoryByName(categoryName);
            
            if (category == null) {
                return String.format("❌ **Catégorie non trouvée : \"%s\"**\n\n" +
                    "💡 **Suggestions :**\n" +
                    "▫️ Vérifiez l'orthographe\n" +
                    "▫️ Tapez \"catégories\" pour voir toutes les options\n" +
                    "▫️ Essayez des termes plus généraux\n\n" +
                    "🔍 **Catégories populaires :** IA, Marketing, Design, Business", 
                    categoryName);
            }
            
            List<Formation> formations = category.getFormations() != null ? 
                category.getFormations() : 
                formationRepository.findByCategoryId(category.getId());
            
            if (formations.isEmpty()) {
                return String.format("📂 **%s**\n\n" +
                    "Aucune formation disponible actuellement dans cette catégorie.\n\n" +
                    "🔄 Notre catalogue évolue régulièrement !\n" +
                    "💡 Tapez \"catégories\" pour explorer d'autres domaines.", 
                    category.getName());
            }
            
            StringBuilder response = new StringBuilder();
            response.append(String.format("🎓 **Formations en %s**\n", category.getName()));
            response.append(String.format("📊 **%d formation%s disponible%s**\n\n", 
                formations.size(), 
                formations.size() > 1 ? "s" : "",
                formations.size() > 1 ? "s" : ""));
            
            for (Formation formation : formations) {
                String formationName = getFormationDisplayName(formation);
                response.append("🎯 **").append(formationName).append("**\n");
                
                if (formation.getDescription() != null && !formation.getDescription().isEmpty()) {
                    String shortDesc = formation.getDescription().length() > 100 ? 
                        formation.getDescription().substring(0, 100) + "..." : 
                        formation.getDescription();
                    response.append("   📝 ").append(shortDesc).append("\n");
                }
                
                // Ajouter le prix si disponible
                if (formation.getPrice() != null) {
                    response.append("   💰 ").append(formation.getPrice()).append("€\n");
                }
                
                // Ajouter les dates si disponibles
                if (formation.getDateDebut() != null) {
                    response.append("   📅 Début : ").append(
                        formation.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                    ).append("\n");
                }
                
                response.append("\n");
            }
            
            response.append("💬 **Intéressé par une formation ?** Demandez-moi plus de détails !");
            return response.toString();
            
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche de formations par catégorie: " + categoryName, e);
            return "❌ **Erreur de recherche**\n\n" +
                   "Problème lors de la recherche dans cette catégorie.\n" +
                   "💡 Reformulez votre demande ou essayez \"catégories\".";
        }
    }
    
    private String getSpecificFormationResponse(String formationName) {
        try {
            List<Formation> formations = formationRepository.searchFormations(formationName);
            
            if (formations.isEmpty()) {
                return String.format("🔍 **Formation recherchée : \"%s\"**\n\n" +
                    "Aucune formation trouvée avec ce nom.\n\n" +
                    "💡 **Suggestions :**\n" +
                    "▫️ Vérifiez l'orthographe\n" +
                    "▫️ Utilisez des mots-clés plus simples\n" +
                    "▫️ Tapez \"formations\" pour voir le catalogue complet\n" +
                    "▫️ Essayez \"formations en [domaine]\"", formationName);
            }
            
            Formation formation = formations.get(0);
            StringBuilder response = new StringBuilder();
            
            String displayName = getFormationDisplayName(formation);
            response.append("📖 **").append(displayName).append("**\n\n");
            
            // Catégorie
            if (formation.getCategory() != null) {
                response.append("📂 **Catégorie :** ").append(formation.getCategory().getName()).append("\n");
            }
            
            // Description
            if (formation.getDescription() != null && !formation.getDescription().isEmpty()) {
                response.append("📝 **Description :**\n").append(formation.getDescription()).append("\n\n");
            }
            
            // Prix
            if (formation.getPrice() != null) {
                response.append("💰 **Prix :** ").append(formation.getPrice()).append("€\n");
            }
            
            // Dates
            if (formation.getDateDebut() != null) {
                response.append("📅 **Date de début :** ").append(
                    formation.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                ).append("\n");
            }
            
            if (formation.getDateFin() != null) {
                response.append("🏁 **Date de fin :** ").append(
                    formation.getDateFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                ).append("\n");
            }
            
            if (formation.getRegistrationEndDate() != null) {
                response.append("⏰ **Fin d'inscription :** ").append(
                    formation.getRegistrationEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                ).append("\n");
            }
            
            // Note moyenne
            if (formation.getAverageRating() != null && formation.getAverageRating() > 0) {
                response.append("⭐ **Note moyenne :** ").append(formation.getAverageRating()).append("/5\n");
            }
            
            response.append("\n🌐 **Plus d'informations :** ").append(baseUrl).append("/formations\n");
            response.append("💬 **D'autres questions sur cette formation ?**");
            
            return response.toString();
            
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche de formation spécifique: " + formationName, e);
            return "❌ **Erreur de recherche**\n\n" +
                   "Problème lors de la recherche de cette formation.\n" +
                   "💡 Réessayez avec un nom différent.";
        }
    }
    
    private String getDefaultResponse() {
        List<String> responses = Arrays.asList(
            "🤔 **Je me spécialise dans les formations !**\n\n💡 **Essayez :**\n▫️ \"formations\"\n▫️ \"catégories\"\n▫️ \"formations en IA\"\n▫️ \"prix des formations\"",
            "❓ **Reformulez votre question sur les formations**\n\n🎓 **Je peux vous aider avec :**\n▫️ Liste des formations\n▫️ Catégories disponibles\n▫️ Détails d'une formation\n▫️ Tarifs et inscriptions",
            "🎯 **Assistant formations à votre service !**\n\n💬 **Exemples de questions :**\n▫️ \"Quelles formations en marketing ?\"\n▫️ \"Toutes les catégories\"\n▫️ \"Comment s'inscrire ?\""
        );
        return responses.get(new Random().nextInt(responses.size()));
    }
    
    // === MÉTHODES UTILITAIRES ===
    
    private boolean containsAny(String text, Set<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }
    
    private String getFormationDisplayName(Formation formation) {
        if (formation.getTitle() != null && !formation.getTitle().trim().isEmpty()) {
            return formation.getTitle();
        }
        if (formation.getName() != null && !formation.getName().trim().isEmpty()) {
            return formation.getName();
        }
        return "Formation sans nom";
    }
    
    private Category findCategoryByName(String categoryName) {
        try {
            // Recherche exacte d'abord
            List<Category> exactMatches = categoryRepository.findByNameContainingIgnoreCase(categoryName);
            if (!exactMatches.isEmpty()) {
                return exactMatches.get(0);
            }
            
            // Recherche avec les mots-clés mappés
            String mappedCategory = categoryKeywords.get(categoryName.toLowerCase());
            if (mappedCategory != null) {
                List<Category> mappedMatches = categoryRepository.findByNameContainingIgnoreCase(mappedCategory);
                if (!mappedMatches.isEmpty()) {
                    return mappedMatches.get(0);
                }
            }
            
            // Recherche partielle
            List<Category> allCategories = categoryRepository.findAll();
            for (Category category : allCategories) {
                if (category.getName().toLowerCase().contains(categoryName.toLowerCase()) ||
                    categoryName.toLowerCase().contains(category.getName().toLowerCase())) {
                    return category;
                }
            }
            
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche de catégorie: " + categoryName, e);
        }
        return null;
    }
    
    private String extractCategoryFromMessage(String message) {
        // Patterns pour extraire le nom de catégorie
        String[] patterns = {
            "formations en ", "formations dans ", "formations de ",
            "cours en ", "cours dans ", "cours de ",
            "quelles formations en ", "quelles formations dans "
        };
        
        for (String pattern : patterns) {
            int index = message.indexOf(pattern);
            if (index != -1) {
                String remaining = message.substring(index + pattern.length()).trim();
                if (!remaining.isEmpty()) {
                    // Nettoyer et extraire le nom
                    String cleanName = remaining.replaceAll("[?.,!]", "").trim();
                    String[] words = cleanName.split("\\s+");
                    if (words.length > 0 && words[0].length() > 1) {
                        return words[0]; // Premier mot significatif
                    }
                }
            }
        }
        
        // Vérifier les mots-clés directs
        for (String keyword : categoryKeywords.keySet()) {
            if (message.contains(keyword)) {
                return keyword;
            }
        }
        
        return null;
    }
    
    private String extractFormationNameFromMessage(String message) {
        // Patterns pour extraire le nom de formation
        String[] patterns = {"formation ", "cours ", "programme ", "détails ", "parlez-moi de ", "info "};
        
        for (String pattern : patterns) {
            int index = message.indexOf(pattern);
            if (index != -1) {
                String remaining = message.substring(index + pattern.length()).trim();
                if (!remaining.isEmpty()) {
                    // Nettoyer et extraire le nom
                    String cleanName = remaining.replaceAll("[?.,!]", "").trim();
                    if (cleanName.length() > 2) { // Au moins 3 caractères
                        return cleanName;
                    }
                }
            }
        }
        return null;
    }
}