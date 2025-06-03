package com.cmdpfe.demande.Service.statistic;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Entity.statistic.ConsentRecord;
import com.cmdpfe.demande.Entity.statistic.HeatmapData;
import com.cmdpfe.demande.Entity.statistic.InteractionTrackingRequest;
import com.cmdpfe.demande.Entity.statistic.UserInteraction;
import com.cmdpfe.demande.Entity.statistic.UserPreference;
import com.cmdpfe.demande.Repository.*;
import com.cmdpfe.demande.Repository.stats.ConsentRecordRepository;
import com.cmdpfe.demande.Repository.stats.HeatmapDataRepository;
import com.cmdpfe.demande.Repository.stats.UserInteractionRepository;
import com.cmdpfe.demande.Repository.stats.UserPreferenceRepository;
import com.cmdpfe.demande.jwt.CustomJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HeatmapTrackingService {

    @Autowired
    private ConsentRecordRepository consentRecordRepository;
    
    @Autowired
    private UserInteractionRepository userInteractionRepository;
    
    @Autowired
    private HeatmapDataRepository heatmapDataRepository;
    
    @Autowired
    private UserPreferenceRepository userPreferenceRepository;
    
    @Autowired
    private ClientRepository clientRepository;

    // 1. Consent Management Methods
    
    @Transactional
    public ConsentRecord recordConsent(String sessionId, String clientEmail, String ipAddress, 
                                     String userAgent, Set<String> consentedDataTypes) {
        ConsentRecord consent = new ConsentRecord();
        
        // Handle authenticated vs anonymous users
        if (clientEmail != null) {
            Client client = clientRepository.findByEmail(clientEmail);
            if (client != null) {
                consent.setClient(client);
                // Check for existing consent record
                Optional<ConsentRecord> existing = consentRecordRepository.findByClient(client);
                if (existing.isPresent()) {
                    consent = existing.get();
                }
            }
        }
        
        // Always set session hash for tracking
        consent.setSessionHash(hashSessionId(sessionId));
        consent.setAnonymizedIp(anonymizeIp(ipAddress));
        consent.setUserAgent(userAgent);
        consent.setBrowserFingerprint(generateBrowserFingerprint(userAgent));
        consent.setConsentGiven(true);
        consent.setConsentDate(LocalDateTime.now());
        consent.setConsentedDataTypes(String.join(",", consentedDataTypes));
        consent.setRetentionExpiry(LocalDateTime.now().plusMonths(13)); // GDPR compliance
        
        return consentRecordRepository.save(consent);
    }
    
    @Transactional
    public void withdrawConsent(String sessionId, String clientEmail) {
        ConsentRecord consent = findConsentRecord(sessionId, clientEmail);
        if (consent != null) {
            consent.setConsentGiven(false);
            consent.setConsentWithdrawnDate(LocalDateTime.now());
            consentRecordRepository.save(consent);
            
            // Mark related interactions for anonymization/deletion
            anonymizeUserData(consent);
        }
    }
    
    public boolean hasValidConsent(String sessionId, String clientEmail, String dataType) {
        ConsentRecord consent = findConsentRecord(sessionId, clientEmail);
        if (consent == null || !consent.getConsentGiven() || consent.getConsentWithdrawnDate() != null) {
            return false;
        }
        
        // Check if specific data type is consented
        String consentedTypes = consent.getConsentedDataTypes();
        return consentedTypes != null && consentedTypes.contains(dataType);
    }
    
    // 2. Interaction Tracking Methods
    
    @Async
    @Transactional
    public void trackInteraction(InteractionTrackingRequest request) {
        // Verify consent first
        if (!hasValidConsent(request.getSessionId(), request.getClientEmail(), "page_views")) {
            return; // Don't track without consent
        }
        
        ConsentRecord consent = findConsentRecord(request.getSessionId(), request.getClientEmail());
        if (consent == null) return;
        
        UserInteraction interaction = new UserInteraction();
        
        // Set user identification
        if (consent.getClient() != null) {
            interaction.setClient(consent.getClient());
        }
        interaction.setSessionHash(consent.getSessionHash());
        interaction.setConsentRecord(consent);
        
        // Set interaction details
        interaction.setInteractionType(request.getInteractionType());
        interaction.setPageUrl(request.getPageUrl());
        interaction.setPageTitle(request.getPageTitle());
        interaction.setFormationId(request.getFormationId());
        interaction.setCategoryId(request.getCategoryId());
        
        // Set metrics
        interaction.setDurationSeconds(request.getDurationSeconds());
        interaction.setScrollDepthPercentage(request.getScrollDepthPercentage());
        interaction.setClickX(request.getClickX());
        interaction.setClickY(request.getClickY());
        interaction.setElementSelector(request.getElementSelector());
        
        // Set device info
        interaction.setViewportWidth(request.getViewportWidth());
        interaction.setViewportHeight(request.getViewportHeight());
        interaction.setDeviceType(request.getDeviceType());
        interaction.setBrowserName(request.getBrowserName());
        
        interaction.setInteractionDate(LocalDateTime.now());
        
        userInteractionRepository.save(interaction);
        
        // Update aggregated heatmap data asynchronously
        updateHeatmapData(request.getPageUrl(), request.getFormationId(), request.getCategoryId());
    }
    
    // 3. Analytics and Reporting Methods
    
    public Map<String, Object> getFormationAnalytics(Long formationId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> metrics = userInteractionRepository.getFormationPopularityMetrics(startDate, endDate);
        Map<String, Object> analytics = new HashMap<>();
        
        for (Object[] metric : metrics) {
            if (metric[0].equals(formationId)) {
                analytics.put("totalInteractions", metric[1]);
                analytics.put("uniqueUsers", metric[2]);
                analytics.put("averageDuration", metric[3]);
                break;
            }
        }
        
        // Get click heatmap data
        String formationPageUrl = "/formations/" + formationId;
        List<Object[]> clickData = userInteractionRepository.getClickHeatmapData(formationPageUrl, startDate, endDate);
        analytics.put("clickHeatmap", formatClickHeatmapData(clickData));
        
        return analytics;
    }
    
    public Map<String, Object> getCategoryAnalytics(Long categoryId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> metrics = userInteractionRepository.getCategoryEngagementMetrics(startDate, endDate);
        Map<String, Object> analytics = new HashMap<>();
        
        for (Object[] metric : metrics) {
            if (metric[0].equals(categoryId)) {
                analytics.put("totalInteractions", metric[1]);
                analytics.put("uniqueUsers", metric[2]);
                analytics.put("averageScrollDepth", metric[3]);
                break;
            }
        }
        
        return analytics;
    }
    
    public List<Map<String, Object>> getPopularFormations(int limit) {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        List<Object[]> metrics = userInteractionRepository.getFormationPopularityMetrics(oneMonthAgo, LocalDateTime.now());
        
        return metrics.stream()
                .limit(limit)
                .map(this::formatFormationMetric)
                .collect(Collectors.toList());
    }
    
    // 4. User Preference Inference
    
    @Async
    @Transactional
    public void updateUserPreferences(String sessionId, String clientEmail) {
        ConsentRecord consent = findConsentRecord(sessionId, clientEmail);
        if (consent == null) return;
        
        UserPreference preference = findOrCreateUserPreference(consent);
        
        // Get user's recent interactions
        List<UserInteraction> interactions;
        if (consent.getClient() != null) {
            interactions = userInteractionRepository.findByClientOrderByInteractionDateDesc(consent.getClient());
        } else {
            interactions = userInteractionRepository.findBySessionHashOrderByInteractionDateDesc(consent.getSessionHash());
        }
        
        // Analyze interactions to infer preferences
        Map<Long, Integer> categoryScores = new HashMap<>();
        Map<Long, Integer> formationScores = new HashMap<>();
        double totalEngagement = 0;
        
        for (UserInteraction interaction : interactions.stream().limit(100).collect(Collectors.toList())) {
            // Calculate engagement score based on interaction type and duration
            double interactionScore = calculateInteractionScore(interaction);
            totalEngagement += interactionScore;
            
            // Update category scores
            if (interaction.getCategoryId() != null) {
                categoryScores.merge(interaction.getCategoryId(), (int) interactionScore, Integer::sum);
            }
            
            // Update formation scores
            if (interaction.getFormationId() != null) {
                formationScores.merge(interaction.getFormationId(), (int) interactionScore, Integer::sum);
            }
        }
        
        // Convert to JSON and save
        preference.setPreferredCategories(convertToJsonScores(categoryScores));
        preference.setPreferredFormations(convertToJsonScores(formationScores));
        preference.setEngagementScore(totalEngagement / Math.max(interactions.size(), 1));
        preference.setLastCalculated(LocalDateTime.now());
        
        userPreferenceRepository.save(preference);
    }
    
    // 5. Privacy and Compliance Methods
    
    @Transactional
    public void cleanupExpiredData() {
        LocalDateTime now = LocalDateTime.now();
        
        // Find and delete expired consent records and related data
        List<ConsentRecord> expiredConsents = consentRecordRepository.findExpiredConsents(now);
        
        for (ConsentRecord consent : expiredConsents) {
            // Delete related interactions
            List<UserInteraction> interactions;
            if (consent.getClient() != null) {
                interactions = userInteractionRepository.findByClientOrderByInteractionDateDesc(consent.getClient());
            } else {
                interactions = userInteractionRepository.findBySessionHashOrderByInteractionDateDesc(consent.getSessionHash());
            }
            userInteractionRepository.deleteAll(interactions);
            
            // Delete user preferences
            UserPreference preference;
            if (consent.getClient() != null) {
                preference = userPreferenceRepository.findByClient(consent.getClient()).orElse(null);
            } else {
                preference = userPreferenceRepository.findBySessionHash(consent.getSessionHash()).orElse(null);
            }
            if (preference != null) {
                userPreferenceRepository.delete(preference);
            }
            
            // Delete consent record
            consentRecordRepository.delete(consent);
        }
    }
    
    @Transactional
    public void anonymizeUserData(ConsentRecord consent) {
        // Replace identifiable data with anonymized versions
        List<UserInteraction> interactions;
        if (consent.getClient() != null) {
            interactions = userInteractionRepository.findByClientOrderByInteractionDateDesc(consent.getClient());
        } else {
            interactions = userInteractionRepository.findBySessionHashOrderByInteractionDateDesc(consent.getSessionHash());
        }
        
        for (UserInteraction interaction : interactions) {
            interaction.setClient(null);
            interaction.setSessionHash("ANONYMIZED_" + System.currentTimeMillis());
            userInteractionRepository.save(interaction);
        }
    }
    
    // 6. Utility Methods
    
    private ConsentRecord findConsentRecord(String sessionId, String clientEmail) {
        String sessionHash = hashSessionId(sessionId);
        
        if (clientEmail != null) {
            Client client = clientRepository.findByEmail(clientEmail);
            if (client != null) {
                return consentRecordRepository.findByClient(client).orElse(null);
            }
        }
        
        return consentRecordRepository.findBySessionHash(sessionHash).orElse(null);
    }
    
    private UserPreference findOrCreateUserPreference(ConsentRecord consent) {
        UserPreference preference;
        
        if (consent.getClient() != null) {
            preference = userPreferenceRepository.findByClient(consent.getClient()).orElse(new UserPreference());
            preference.setClient(consent.getClient());
        } else {
            preference = userPreferenceRepository.findBySessionHash(consent.getSessionHash()).orElse(new UserPreference());
            preference.setSessionHash(consent.getSessionHash());
        }
        
        return preference;
    }
    
    private String hashSessionId(String sessionId) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(sessionId.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    private String anonymizeIp(String ipAddress) {
        if (ipAddress == null) return null;
        
        // For IPv4: Replace last octet with 0 (e.g., 192.168.1.123 -> 192.168.1.0)
        if (ipAddress.contains(".")) {
            String[] parts = ipAddress.split("\\.");
            if (parts.length == 4) {
                return parts[0] + "." + parts[1] + "." + parts[2] + ".0";
            }
        }
        
        // For IPv6: Keep first 64 bits, zero out the rest
        if (ipAddress.contains(":")) {
            String[] parts = ipAddress.split(":");
            if (parts.length >= 4) {
                return parts[0] + ":" + parts[1] + ":" + parts[2] + ":" + parts[3] + "::";
            }
        }
        
        return "ANONYMIZED";
    }
    
    private String generateBrowserFingerprint(String userAgent) {
        // Create a simple fingerprint based on user agent
        return hashSessionId(userAgent).substring(0, 16);
    }
    
    private void updateHeatmapData(String pageUrl, Long formationId, Long categoryId) {
        HeatmapData heatmap = heatmapDataRepository.findByPageUrl(pageUrl)
                .orElse(new HeatmapData());
        
        heatmap.setPageUrl(pageUrl);
        heatmap.setFormationId(formationId);
        heatmap.setCategoryId(categoryId);
        heatmap.setTotalViews(heatmap.getTotalViews() + 1);
        heatmap.setLastUpdated(LocalDateTime.now());
        
        heatmapDataRepository.save(heatmap);
    }
    
    private double calculateInteractionScore(UserInteraction interaction) {
        double score = 0;
        
        switch (interaction.getInteractionType()) {
            case PAGE_VIEW:
                score = 1;
                if (interaction.getDurationSeconds() != null) {
                    score += Math.min(interaction.getDurationSeconds() / 60.0, 5); // Max 5 points for duration
                }
                break;
            case CLICK:
                score = 2;
                break;
            case SCROLL:
                score = 0.5;
                if (interaction.getScrollDepthPercentage() != null) {
                    score += interaction.getScrollDepthPercentage() / 100.0;
                }
                break;
            case INTEREST_MARKED:
                score = 10; // High value action
                break;
            case DOWNLOAD:
                score = 5;
                break;
            default:
                score = 1;
        }
        
        return score;
    }
    
    private String convertToJsonScores(Map<Long, Integer> scores) {
        // Convert map to JSON string format
        return scores.entrySet().stream()
                .map(entry -> "\"" + entry.getKey() + "\":" + entry.getValue())
                .collect(Collectors.joining(",", "{", "}"));
    }
    
    private List<Map<String, Object>> formatClickHeatmapData(List<Object[]> clickData) {
        return clickData.stream().map(data -> {
            Map<String, Object> click = new HashMap<>();
            click.put("x", data[0]);
            click.put("y", data[1]);
            click.put("element", data[2]);
            return click;
        }).collect(Collectors.toList());
    }
    
    private Map<String, Object> formatFormationMetric(Object[] metric) {
        Map<String, Object> formatted = new HashMap<>();
        formatted.put("formationId", metric[0]);
        formatted.put("totalInteractions", metric[1]);
        formatted.put("uniqueUsers", metric[2]);
        formatted.put("averageDuration", metric[3]);
        return formatted;
    }
    public Map<String, Object> getDashboardStats(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> stats = new HashMap<>();

        // Récupération des métriques de popularité des formations
        List<Object[]> metrics = userInteractionRepository.getFormationPopularityMetrics(startDate, endDate);
        long totalInteractions = 0;
        Set<Long> uniqueUsers = new HashSet<>();
        double totalDuration = 0;

        for (Object[] metric : metrics) {
            totalInteractions += ((Number) metric[1]).longValue();
            uniqueUsers.add(((Number) metric[0]).longValue()); // Assuming this is formationId or clientId
            totalDuration += ((Number) metric[3]).doubleValue();
        }

        stats.put("totalInteractions", totalInteractions);
        stats.put("uniqueUsers", uniqueUsers.size());
        stats.put("averageDurationMinutes", totalInteractions > 0 ? totalDuration / totalInteractions : 0);

        // Top 5 formations populaires
        List<Map<String, Object>> popularFormations = metrics.stream()
                .limit(5)
                .map(this::formatFormationMetric)
                .collect(Collectors.toList());
        stats.put("topFormations", popularFormations);

        return stats;
    }

}