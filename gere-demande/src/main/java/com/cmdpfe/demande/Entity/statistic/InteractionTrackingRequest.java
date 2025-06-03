package com.cmdpfe.demande.Entity.statistic;

public class InteractionTrackingRequest {
    private String sessionId;
    private String clientEmail;
    private InteractionType interactionType; // PAGE_VIEW, CLICK, SCROLL
    private String pageUrl;
    private String pageTitle;
    private Long formationId;
    private Long categoryId;
    
    // Simple metrics only
    private Long durationSeconds;     // Time spent on page
    private Integer clickX;           // Click coordinates
    private Integer clickY;
    private Integer scrollDepthPercentage; // How far user scrolled (0-100)
    
    // Basic device info
    private Integer viewportWidth;
    private Integer viewportHeight;
    private String deviceType;  // mobile, tablet, desktop
    private String browserName;
    
    // Optional element info for clicks
    private String elementSelector;
    
    // Constructors
    public InteractionTrackingRequest() {}
    
    // Getters and setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    
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
    
    public Integer getClickX() { return clickX; }
    public void setClickX(Integer clickX) { this.clickX = clickX; }
    
    public Integer getClickY() { return clickY; }
    public void setClickY(Integer clickY) { this.clickY = clickY; }
    
    public Integer getScrollDepthPercentage() { return scrollDepthPercentage; }
    public void setScrollDepthPercentage(Integer scrollDepthPercentage) { 
        this.scrollDepthPercentage = scrollDepthPercentage; 
    }
    
    public Integer getViewportWidth() { return viewportWidth; }
    public void setViewportWidth(Integer viewportWidth) { this.viewportWidth = viewportWidth; }
    
    public Integer getViewportHeight() { return viewportHeight; }
    public void setViewportHeight(Integer viewportHeight) { this.viewportHeight = viewportHeight; }
    
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    
    public String getBrowserName() { return browserName; }
    public void setBrowserName(String browserName) { this.browserName = browserName; }
    
    public String getElementSelector() { return elementSelector; }
    public void setElementSelector(String elementSelector) { this.elementSelector = elementSelector; }
}