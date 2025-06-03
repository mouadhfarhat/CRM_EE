package com.cmdpfe.demande.Entity.statistic;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.cmdpfe.demande.Entity.Client;

@Entity
@Table(name = "consent_records")
public class ConsentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // For authenticated users
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;
    
    // For anonymous users - hashed session ID
    @Column(name = "session_hash")
    private String sessionHash;
    
    // Anonymized IP (e.g., 192.168.1.0 instead of 192.168.1.123)
    @Column(name = "anonymized_ip")
    private String anonymizedIp;
    
    @Column(name = "consent_given", nullable = false)
    private Boolean consentGiven = false;
    
    @Column(name = "consent_date")
    private LocalDateTime consentDate;
    
    @Column(name = "consent_withdrawn_date")
    private LocalDateTime consentWithdrawnDate;
    
    // JSON string of consented data types
    @Column(name = "consented_data_types", columnDefinition = "TEXT")
    private String consentedDataTypes; // "page_views,clicks,scroll_behavior"
    
    @Column(name = "browser_fingerprint")
    private String browserFingerprint;
    
    @Column(name = "user_agent", length = 500)
    private String userAgent;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // GDPR: Data retention period (default 13 months)
    @Column(name = "retention_expiry")
    private LocalDateTime retentionExpiry;
    
    // Constructors, getters, setters
    public ConsentRecord() {
        this.retentionExpiry = LocalDateTime.now().plusMonths(13);
    }
    
    // ... getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public String getSessionHash() { return sessionHash; }
    public void setSessionHash(String sessionHash) { this.sessionHash = sessionHash; }
    
    public String getAnonymizedIp() { return anonymizedIp; }
    public void setAnonymizedIp(String anonymizedIp) { this.anonymizedIp = anonymizedIp; }
    
    public Boolean getConsentGiven() { return consentGiven; }
    public void setConsentGiven(Boolean consentGiven) { this.consentGiven = consentGiven; }
    
    public LocalDateTime getConsentDate() { return consentDate; }
    public void setConsentDate(LocalDateTime consentDate) { this.consentDate = consentDate; }
    
    public LocalDateTime getConsentWithdrawnDate() { return consentWithdrawnDate; }
    public void setConsentWithdrawnDate(LocalDateTime consentWithdrawnDate) { 
        this.consentWithdrawnDate = consentWithdrawnDate; 
    }
    
    public String getConsentedDataTypes() { return consentedDataTypes; }
    public void setConsentedDataTypes(String consentedDataTypes) { 
        this.consentedDataTypes = consentedDataTypes; 
    }
    
    public String getBrowserFingerprint() { return browserFingerprint; }
    public void setBrowserFingerprint(String browserFingerprint) { 
        this.browserFingerprint = browserFingerprint; 
    }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getRetentionExpiry() { return retentionExpiry; }
    public void setRetentionExpiry(LocalDateTime retentionExpiry) { 
        this.retentionExpiry = retentionExpiry; 
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}