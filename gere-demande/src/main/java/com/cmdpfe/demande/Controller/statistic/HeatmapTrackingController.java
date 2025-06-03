package com.cmdpfe.demande.Controller.statistic;


import com.cmdpfe.demande.Entity.statistic.BatchTrackingRequest;
import com.cmdpfe.demande.Entity.statistic.ConsentRecord;
import com.cmdpfe.demande.Entity.statistic.ConsentRequest;
import com.cmdpfe.demande.Entity.statistic.ConsentWithdrawalRequest;
import com.cmdpfe.demande.Entity.statistic.InteractionTrackingRequest;
import com.cmdpfe.demande.Service.statistic.HeatmapTrackingService;
import com.cmdpfe.demande.jwt.CustomJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/heatmap")
public class HeatmapTrackingController {

 @Autowired
 private HeatmapTrackingService trackingService;

 // 1. CONSENT MANAGEMENT ENDPOINTS

 /**
  * Record user consent for data tracking
  * Public endpoint - works for both authenticated and anonymous users
  */
 @PostMapping("/consent")
 public ResponseEntity<Map<String, Object>> recordConsent(
         @RequestBody ConsentRequest request,
         HttpServletRequest httpRequest) {
     
     try {
         String sessionId = request.getSessionId();
         String clientEmail = getCurrentUserEmail();
         String ipAddress = getClientIpAddress(httpRequest);
         String userAgent = httpRequest.getHeader("User-Agent");
         
         Set<String> consentedDataTypes = new HashSet<>(request.getConsentedDataTypes());
         
         ConsentRecord consent = trackingService.recordConsent(
             sessionId, clientEmail, ipAddress, userAgent, consentedDataTypes);
         
         Map<String, Object> response = new HashMap<>();
         response.put("success", true);
         response.put("consentId", consent.getId());
         response.put("message", "Consent recorded successfully");
         response.put("dataTypes", consentedDataTypes);
         
         return ResponseEntity.ok(response);
         
     } catch (Exception e) {
         Map<String, Object> errorResponse = new HashMap<>();
         errorResponse.put("success", false);
         errorResponse.put("error", "Failed to record consent: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 /**
  * Withdraw user consent
  * Public endpoint - works for both authenticated and anonymous users
  */
 @PostMapping("/consent/withdraw")
 public ResponseEntity<Map<String, String>> withdrawConsent(
         @RequestBody ConsentWithdrawalRequest request) {
     
     try {
         String sessionId = request.getSessionId();
         String clientEmail = getCurrentUserEmail();
         
         trackingService.withdrawConsent(sessionId, clientEmail);
         
         Map<String, String> response = new HashMap<>();
         response.put("success", "true");
         response.put("message", "Consent withdrawn successfully. Your data will be anonymized.");
         
         return ResponseEntity.ok(response);
         
     } catch (Exception e) {
         Map<String, String> errorResponse = new HashMap<>();
         errorResponse.put("success", "false");
         errorResponse.put("error", "Failed to withdraw consent: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 /**
  * Check consent status
  * Public endpoint
  */
 @GetMapping("/consent/status")
 public ResponseEntity<Map<String, Object>> getConsentStatus(
         @RequestParam String sessionId,
         @RequestParam(required = false) String dataType) {
     
     String clientEmail = getCurrentUserEmail();
     String checkDataType = dataType != null ? dataType : "page_views";
     
     boolean hasConsent = trackingService.hasValidConsent(sessionId, clientEmail, checkDataType);
     
     Map<String, Object> response = new HashMap<>();
     response.put("hasConsent", hasConsent);
     response.put("dataType", checkDataType);
     response.put("sessionId", sessionId);
     
     return ResponseEntity.ok(response);
 }

 // 2. TRACKING ENDPOINTS

 /**
  * Track user interactions
  * Public endpoint - respects consent settings
  */
 @PostMapping("/track")
 public ResponseEntity<Map<String, String>> trackInteraction(
         @RequestBody InteractionTrackingRequest request,
         HttpServletRequest httpRequest) {
     
     try {
         // Enhance request with server-side data
         String clientEmail = getCurrentUserEmail();
         request.setClientEmail(clientEmail);
         
         // Add device detection if not provided
         if (request.getDeviceType() == null) {
             request.setDeviceType(detectDeviceType(httpRequest.getHeader("User-Agent")));
         }
         if (request.getBrowserName() == null) {
             request.setBrowserName(detectBrowserName(httpRequest.getHeader("User-Agent")));
         }
         
         // Async tracking - won't block response
         trackingService.trackInteraction(request);
         
         Map<String, String> response = new HashMap<>();
         response.put("success", "true");
         response.put("message", "Interaction tracked successfully");
         
         return ResponseEntity.ok(response);
         
     } catch (Exception e) {
         Map<String, String> errorResponse = new HashMap<>();
         errorResponse.put("success", "false");
         errorResponse.put("error", "Failed to track interaction: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 /**
  * Batch track multiple interactions
  * Public endpoint - for performance optimization
  */
 @PostMapping("/track/batch")
 public ResponseEntity<Map<String, Object>> trackBatchInteractions(
         @RequestBody BatchTrackingRequest request,
         HttpServletRequest httpRequest) {
     
     try {
         String clientEmail = getCurrentUserEmail();
         int successCount = 0;
         int failCount = 0;
         
         for (InteractionTrackingRequest trackingRequest : request.getInteractions()) {
             try {
                 trackingRequest.setClientEmail(clientEmail);
                 
                 // Add device detection if missing
                 if (trackingRequest.getDeviceType() == null) {
                     trackingRequest.setDeviceType(detectDeviceType(httpRequest.getHeader("User-Agent")));
                 }
                 if (trackingRequest.getBrowserName() == null) {
                     trackingRequest.setBrowserName(detectBrowserName(httpRequest.getHeader("User-Agent")));
                 }
                 
                 trackingService.trackInteraction(trackingRequest);
                 successCount++;
             } catch (Exception e) {
                 failCount++;
             }
         }
         
         Map<String, Object> response = new HashMap<>();
         response.put("success", true);
         response.put("processed", successCount + failCount);
         response.put("successful", successCount);
         response.put("failed", failCount);
         
         return ResponseEntity.ok(response);
         
     } catch (Exception e) {
         Map<String, Object> errorResponse = new HashMap<>();
         errorResponse.put("success", false);
         errorResponse.put("error", "Batch tracking failed: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 // 3. ANALYTICS ENDPOINTS (Admin/Gestionnaire access)

 /**
  * Get formation analytics - SIMPLE STATS ONLY
  * Requires ADMIN or GESTIONNAIRE role
  */
 @GetMapping("/analytics/formation/{formationId}")
 @PreAuthorize("hasRole('ADMIN') or hasRole('GESTIONNAIRE')")
 public ResponseEntity<Map<String, Object>> getFormationAnalytics(
         @PathVariable Long formationId,
         @RequestParam(required = false) String startDate,
         @RequestParam(required = false) String endDate) {
     
     try {
         LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusMonths(1);
         LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
         
         Map<String, Object> analytics = trackingService.getFormationAnalytics(formationId, start, end);
         analytics.put("formationId", formationId);
         analytics.put("dateRange", Map.of("start", start, "end", end));
         
         return ResponseEntity.ok(analytics);
         
     } catch (Exception e) {
         Map<String, Object> errorResponse = new HashMap<>();
         errorResponse.put("error", "Failed to get formation analytics: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 /**
  * Get category analytics - SIMPLE STATS ONLY
  * Requires ADMIN or GESTIONNAIRE role
  */
 @GetMapping("/analytics/category/{categoryId}")
 @PreAuthorize("hasRole('ADMIN') or hasRole('GESTIONNAIRE')")
 public ResponseEntity<Map<String, Object>> getCategoryAnalytics(
         @PathVariable Long categoryId,
         @RequestParam(required = false) String startDate,
         @RequestParam(required = false) String endDate) {
     
     try {
         LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusMonths(1);
         LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
         
         Map<String, Object> analytics = trackingService.getCategoryAnalytics(categoryId, start, end);
         analytics.put("categoryId", categoryId);
         analytics.put("dateRange", Map.of("start", start, "end", end));
         
         return ResponseEntity.ok(analytics);
         
     } catch (Exception e) {
         Map<String, Object> errorResponse = new HashMap<>();
         errorResponse.put("error", "Failed to get category analytics: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 /**
  * Get overall dashboard stats - SIMPLE VERSION
  * Requires ADMIN or GESTIONNAIRE role
  */
 @GetMapping("/analytics/dashboard")
 @PreAuthorize("hasRole('ADMIN') or hasRole('GESTIONNAIRE')")
 public ResponseEntity<Map<String, Object>> getDashboardStats(
         @RequestParam(required = false) String startDate,
         @RequestParam(required = false) String endDate) {
     
     try {
         LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusMonths(1);
         LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
         
         Map<String, Object> dashboard = trackingService.getDashboardStats(start, end);
         dashboard.put("dateRange", Map.of("start", start, "end", end));
         
         return ResponseEntity.ok(dashboard);
         
     } catch (Exception e) {
         Map<String, Object> errorResponse = new HashMap<>();
         errorResponse.put("error", "Failed to get dashboard stats: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }

 /**
  * Get popular formations list
  * Requires ADMIN or GESTIONNAIRE role
  */
 @GetMapping("/analytics/popular-formations")
 @PreAuthorize("hasRole('ADMIN') or hasRole('GESTIONNAIRE')")
 public ResponseEntity<List<Map<String, Object>>> getPopularFormations(
         @RequestParam(defaultValue = "10") int limit) {
     
     try {
         List<Map<String, Object>> popularFormations = trackingService.getPopularFormations(limit);
         return ResponseEntity.ok(popularFormations);
         
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<>());
     }
 }

 // 4. UTILITY METHODS

 /**
  * Get current authenticated user email or null for anonymous
  */
 private String getCurrentUserEmail() {
     try {
         Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
         if (principal instanceof CustomJwt) {
             CustomJwt jwt = (CustomJwt) principal;
             return jwt.getEmail();
         }
     } catch (Exception e) {
         // User is anonymous
     }
     return null;
 }

 /**
  * Extract client IP address
  */
 private String getClientIpAddress(HttpServletRequest request) {
     String[] headerNames = {
         "X-Forwarded-For",
         "X-Real-IP", 
         "Proxy-Client-IP",
         "WL-Proxy-Client-IP",
         "HTTP_X_FORWARDED_FOR",
         "HTTP_X_FORWARDED",
         "HTTP_X_CLUSTER_CLIENT_IP",
         "HTTP_CLIENT_IP",
         "HTTP_FORWARDED_FOR",
         "HTTP_FORWARDED"
     };
     
     for (String header : headerNames) {
         String ip = request.getHeader(header);
         if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
             return ip.split(",")[0].trim();
         }
     }
     
     return request.getRemoteAddr();
 }

 /**
  * Detect device type from User-Agent
  */
 private String detectDeviceType(String userAgent) {
     if (userAgent == null) return "unknown";
     
     userAgent = userAgent.toLowerCase();
     
     if (userAgent.contains("mobile") || userAgent.contains("android") || 
         userAgent.contains("iphone") || userAgent.contains("ipod")) {
         return "mobile";
     }
     
     if (userAgent.contains("tablet") || userAgent.contains("ipad")) {
         return "tablet";
     }
     
     return "desktop";
 }

 /**
  * Detect browser name from User-Agent
  */
 private String detectBrowserName(String userAgent) {
     if (userAgent == null) return "unknown";
     
     userAgent = userAgent.toLowerCase();
     
     if (userAgent.contains("chrome")) return "chrome";
     if (userAgent.contains("firefox")) return "firefox";
     if (userAgent.contains("safari") && !userAgent.contains("chrome")) return "safari";
     if (userAgent.contains("edge")) return "edge";
     if (userAgent.contains("opera")) return "opera";
     if (userAgent.contains("internet explorer") || userAgent.contains("msie")) return "ie";
     
     return "other";
 }
}