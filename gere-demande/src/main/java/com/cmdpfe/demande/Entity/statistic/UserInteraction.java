package com.cmdpfe.demande.Entity.statistic;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.cmdpfe.demande.Entity.Client;

@Entity
@Table(name = "user_interactions")

public class UserInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Link to authenticated user (nullable for anonymous)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;
    
    // Hashed session ID for anonymous users
    @Column(name = "session_hash")
    private String sessionHash;
    
    // Interaction details
    @Enumerated(EnumType.STRING)
    @Column(name = "interaction_type", nullable = false)
    private InteractionType interactionType;
    
    @Column(name = "page_url", nullable = false)
    private String pageUrl;
    
    @Column(name = "page_title")
    private String pageTitle;
    
    // Resource references
    @Column(name = "formation_id")
    private Long formationId;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    // Interaction metrics
    @Column(name = "duration_seconds")
    private Long durationSeconds;
    
    @Column(name = "scroll_depth_percentage")
    private Integer scrollDepthPercentage;
    
    @Column(name = "click_x")
    private Integer clickX;
    
    @Column(name = "click_y")
    private Integer clickY;
    
    @Column(name = "element_selector")
    private String elementSelector;
    
    // Viewport information
    @Column(name = "viewport_width")
    private Integer viewportWidth;
    
    @Column(name = "viewport_height")
    private Integer viewportHeight;
    
    // Device information (anonymized)
    @Column(name = "device_type")
    private String deviceType; // mobile, tablet, desktop
    
    @Column(name = "browser_name")
    private String browserName;
    
    // Timestamps
    @Column(name = "interaction_date", nullable = false)
    private LocalDateTime interactionDate = LocalDateTime.now();
    
    // GDPR: Link to consent record
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_record_id")
    private ConsentRecord consentRecord;
    
    // Constructors, getters, setters
    public UserInteraction() {}
    
    // ... getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public String getSessionHash() { return sessionHash; }
    public void setSessionHash(String sessionHash) { this.sessionHash = sessionHash; }
    
    public InteractionType getInteractionType() { return interactionType; }
    public void setInteractionType(InteractionType interactionType) { 
        this.interactionType = interactionType; 
    }
    
    public String getPageUrl() { return pageUrl; }
    public void setPageUrl(String pageUrl) { this.pageUrl = pageUrl; }
    
    public String getPageTitle() { return pageTitle; }
    public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }
    
    public Long getFormationId() { return formationId; }
    public void setFormationId(Long formationId) { this.formationId = formationId; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public Long getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Long durationSeconds) { this.durationSeconds = durationSeconds; }
    
    public Integer getScrollDepthPercentage() { return scrollDepthPercentage; }
    public void setScrollDepthPercentage(Integer scrollDepthPercentage) { 
        this.scrollDepthPercentage = scrollDepthPercentage; 
    }
    
    public Integer getClickX() { return clickX; }
    public void setClickX(Integer clickX) { this.clickX = clickX; }
    
    public Integer getClickY() { return clickY; }
    public void setClickY(Integer clickY) { this.clickY = clickY; }
    
    public String getElementSelector() { return elementSelector; }
    public void setElementSelector(String elementSelector) { this.elementSelector = elementSelector; }
    
    public Integer getViewportWidth() { return viewportWidth; }
    public void setViewportWidth(Integer viewportWidth) { this.viewportWidth = viewportWidth; }
    
    public Integer getViewportHeight() { return viewportHeight; }
    public void setViewportHeight(Integer viewportHeight) { this.viewportHeight = viewportHeight; }
    
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    
    public String getBrowserName() { return browserName; }
    public void setBrowserName(String browserName) { this.browserName = browserName; }
    
    public LocalDateTime getInteractionDate() { return interactionDate; }
    public void setInteractionDate(LocalDateTime interactionDate) { 
        this.interactionDate = interactionDate; 
    }
    
    public ConsentRecord getConsentRecord() { return consentRecord; }
    public void setConsentRecord(ConsentRecord consentRecord) { this.consentRecord = consentRecord; }
}