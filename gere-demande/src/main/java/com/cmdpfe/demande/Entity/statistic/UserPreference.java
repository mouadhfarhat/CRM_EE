package com.cmdpfe.demande.Entity.statistic;

import java.time.LocalDateTime;

import com.cmdpfe.demande.Entity.Client;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;
    
    @Column(name = "session_hash")
    private String sessionHash;
    
    // Inferred preferences
    @Column(name = "preferred_categories", columnDefinition = "TEXT")
    private String preferredCategories; // JSON array of category IDs with scores
    
    @Column(name = "preferred_formations", columnDefinition = "TEXT")
    private String preferredFormations; // JSON array of formation IDs with scores
    
    @Column(name = "browsing_patterns", columnDefinition = "TEXT")
    private String browsingPatterns; // JSON of behavioral patterns
    
    @Column(name = "engagement_score")
    private Double engagementScore = 0.0;
    
    @Column(name = "last_calculated")
    private LocalDateTime lastCalculated = LocalDateTime.now();
    
    // Constructors, getters, setters
    public UserPreference() {}
    
    // ... getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public String getSessionHash() { return sessionHash; }
    public void setSessionHash(String sessionHash) { this.sessionHash = sessionHash; }
    
    public String getPreferredCategories() { return preferredCategories; }
    public void setPreferredCategories(String preferredCategories) { 
        this.preferredCategories = preferredCategories; 
    }
    
    public String getPreferredFormations() { return preferredFormations; }
    public void setPreferredFormations(String preferredFormations) { 
        this.preferredFormations = preferredFormations; 
    }
    
    public String getBrowsingPatterns() { return browsingPatterns; }
    public void setBrowsingPatterns(String browsingPatterns) { this.browsingPatterns = browsingPatterns; }
    
    public Double getEngagementScore() { return engagementScore; }
    public void setEngagementScore(Double engagementScore) { this.engagementScore = engagementScore; }
    
    public LocalDateTime getLastCalculated() { return lastCalculated; }
    public void setLastCalculated(LocalDateTime lastCalculated) { 
        this.lastCalculated = lastCalculated; 
    }
}