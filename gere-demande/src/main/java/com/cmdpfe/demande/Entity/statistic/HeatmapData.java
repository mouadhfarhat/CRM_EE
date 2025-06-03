package com.cmdpfe.demande.Entity.statistic;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "heatmap_data")
public class HeatmapData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "page_url", nullable = false)
    private String pageUrl;
    
    @Column(name = "formation_id")
    private Long formationId;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    // Aggregated metrics
    @Column(name = "total_views")
    private Long totalViews = 0L;
    
    @Column(name = "unique_sessions")
    private Long uniqueSessions = 0L;
    
    @Column(name = "average_duration_seconds")
    private Double averageDurationSeconds = 0.0;
    
    @Column(name = "average_scroll_depth")
    private Double averageScrollDepth = 0.0;
    
    // Hot zones data (JSON format)
    @Column(name = "click_heatmap_data", columnDefinition = "TEXT")
    private String clickHeatmapData; // JSON array of click coordinates with weights
    
    @Column(name = "scroll_heatmap_data", columnDefinition = "TEXT")
    private String scrollHeatmapData; // JSON array of scroll behavior data
    
    // Device breakdown (JSON)
    @Column(name = "device_breakdown", columnDefinition = "TEXT")
    private String deviceBreakdown; // {"mobile": 60, "desktop": 35, "tablet": 5}
    
    // Engagement metrics
    @Column(name = "bounce_rate")
    private Double bounceRate = 0.0; // Percentage of single-page sessions
    
    @Column(name = "conversion_events")
    private Long conversionEvents = 0L; // Interests marked, applications submitted
    
    // Timestamps
    @Column(name = "date_range_start")
    private LocalDateTime dateRangeStart;
    
    @Column(name = "date_range_end")
    private LocalDateTime dateRangeEnd;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
    
    // Constructors, getters, setters
    public HeatmapData() {}
    
    // ... getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPageUrl() { return pageUrl; }
    public void setPageUrl(String pageUrl) { this.pageUrl = pageUrl; }
    
    public Long getFormationId() { return formationId; }
    public void setFormationId(Long formationId) { this.formationId = formationId; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public Long getTotalViews() { return totalViews; }
    public void setTotalViews(Long totalViews) { this.totalViews = totalViews; }
    
    public Long getUniqueSessions() { return uniqueSessions; }
    public void setUniqueSessions(Long uniqueSessions) { this.uniqueSessions = uniqueSessions; }
    
    public Double getAverageDurationSeconds() { return averageDurationSeconds; }
    public void setAverageDurationSeconds(Double averageDurationSeconds) { 
        this.averageDurationSeconds = averageDurationSeconds; 
    }
    
    public Double getAverageScrollDepth() { return averageScrollDepth; }
    public void setAverageScrollDepth(Double averageScrollDepth) { 
        this.averageScrollDepth = averageScrollDepth; 
    }
    
    public String getClickHeatmapData() { return clickHeatmapData; }
    public void setClickHeatmapData(String clickHeatmapData) { 
        this.clickHeatmapData = clickHeatmapData; 
    }
    
    public String getScrollHeatmapData() { return scrollHeatmapData; }
    public void setScrollHeatmapData(String scrollHeatmapData) { 
        this.scrollHeatmapData = scrollHeatmapData; 
    }
    
    public String getDeviceBreakdown() { return deviceBreakdown; }
    public void setDeviceBreakdown(String deviceBreakdown) { this.deviceBreakdown = deviceBreakdown; }
    
    public Double getBounceRate() { return bounceRate; }
    public void setBounceRate(Double bounceRate) { this.bounceRate = bounceRate; }
    
    public Long getConversionEvents() { return conversionEvents; }
    public void setConversionEvents(Long conversionEvents) { this.conversionEvents = conversionEvents; }
    
    public LocalDateTime getDateRangeStart() { return dateRangeStart; }
    public void setDateRangeStart(LocalDateTime dateRangeStart) { 
        this.dateRangeStart = dateRangeStart; 
    }
    
    public LocalDateTime getDateRangeEnd() { return dateRangeEnd; }
    public void setDateRangeEnd(LocalDateTime dateRangeEnd) { this.dateRangeEnd = dateRangeEnd; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}