package com.cmdpfe.demande.Entity.statistic;

import java.util.List;
import java.util.Set;

public class ConsentRequest {
 private String sessionId;
 private List<String> consentedDataTypes; // ["page_views", "clicks", "time_tracking"]
 
 public ConsentRequest() {}
 
 public String getSessionId() { return sessionId; }
 public void setSessionId(String sessionId) { this.sessionId = sessionId; }
 
 public List<String> getConsentedDataTypes() { return consentedDataTypes; }
 public void setConsentedDataTypes(List<String> consentedDataTypes) { 
     this.consentedDataTypes = consentedDataTypes; 
 }
}


