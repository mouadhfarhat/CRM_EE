import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Interfaces for request/response types
export interface ConsentRequest {
  sessionId: string;
  consentedDataTypes: string[];
}

export interface ConsentWithdrawalRequest {
  sessionId: string;
}

export interface InteractionTrackingRequest {
  sessionId: string;
  pageUrl: string;
  elementId?: string;
  elementType?: string;
  actionType: string; // 'click', 'hover', 'scroll', 'page_view', etc.
  xCoordinate?: number;
  yCoordinate?: number;
  timestamp?: string;
  formationId?: number;
  categoryId?: number;
  deviceType?: string;
  browserName?: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  clientEmail?: string;
}

export interface BatchTrackingRequest {
  interactions: InteractionTrackingRequest[];
}

export interface ConsentResponse {
  success: boolean;
  consentId?: string;
  message: string;
  dataTypes?: string[];
  error?: string;
}

export interface ConsentStatus {
  hasConsent: boolean;
  dataType: string;
  sessionId: string;
}

export interface TrackingResponse {
  success: string;
  message: string;
  error?: string;
}

export interface BatchTrackingResponse {
  success: boolean;
  processed: number;
  successful: number;
  failed: number;
  error?: string;
}

export interface AnalyticsResponse {
  [key: string]: any;
  formationId?: number;
  categoryId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeatmapTrackingService {
  private readonly baseUrl = 'http://localhost:8080/api/heatmap';
  private sessionId: string;
  private consentStatus = new BehaviorSubject<boolean>(false);
  private pendingInteractions: InteractionTrackingRequest[] = [];
  private batchTimer: any;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
    this.checkExistingConsent();
  }

  // Session Management
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Consent Management
  recordConsent(consentedDataTypes: string[]): Observable<ConsentResponse> {
    const request: ConsentRequest = {
      sessionId: this.sessionId,
      consentedDataTypes
    };

    return this.http.post<ConsentResponse>(`${this.baseUrl}/consent`, request)
      .pipe(
        map(response => {
          if (response.success) {
            this.consentStatus.next(true);
            localStorage.setItem('heatmap_consent', 'true');
            localStorage.setItem('heatmap_session', this.sessionId);
            localStorage.setItem('heatmap_consent_types', JSON.stringify(consentedDataTypes));
          }
          return response;
        }),
        catchError(error => {
          console.error('Error recording consent:', error);
          return of({ success: false, message: 'Failed to record consent', error: error.message });
        })
      );
  }

  withdrawConsent(): Observable<{ success: string; message: string; error?: string }> {
    const request: ConsentWithdrawalRequest = {
      sessionId: this.sessionId
    };

    return this.http.post<{ success: string; message: string; error?: string }>(`${this.baseUrl}/consent/withdraw`, request)
      .pipe(
        map(response => {
          if (response.success === 'true') {
            this.consentStatus.next(false);
            localStorage.removeItem('heatmap_consent');
            localStorage.removeItem('heatmap_session');
            localStorage.removeItem('heatmap_consent_types');
          }
          return response;
        }),
        catchError(error => {
          console.error('Error withdrawing consent:', error);
          return of({ success: 'false', message: 'Failed to withdraw consent', error: error.message });
        })
      );
  }

  getConsentStatus(dataType: string = 'page_views'): Observable<ConsentStatus> {
    const params = new HttpParams()
      .set('sessionId', this.sessionId)
      .set('dataType', dataType);

    return this.http.get<ConsentStatus>(`${this.baseUrl}/consent/status`, { params })
      .pipe(
        map(response => {
          this.consentStatus.next(response.hasConsent);
          return response;
        }),
        catchError(error => {
          console.error('Error checking consent status:', error);
          return of({ hasConsent: false, dataType, sessionId: this.sessionId });
        })
      );
  }

  hasConsent(): Observable<boolean> {
    return this.consentStatus.asObservable();
  }

  private checkExistingConsent(): void {
    const storedConsent = localStorage.getItem('heatmap_consent');
    const storedSession = localStorage.getItem('heatmap_session');
    
    if (storedConsent === 'true' && storedSession) {
      this.sessionId = storedSession;
      this.getConsentStatus().subscribe();
    }
  }

  // Interaction Tracking
  trackInteraction(interaction: Partial<InteractionTrackingRequest>): Observable<TrackingResponse> {
    if (!this.consentStatus.value) {
      return of({ success: 'false', message: 'No consent given for tracking' });
    }

    const fullInteraction: InteractionTrackingRequest = {
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      deviceType: this.detectDeviceType(),
      browserName: this.detectBrowserName(),
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      ...interaction
    } as InteractionTrackingRequest;

    return this.http.post<TrackingResponse>(`${this.baseUrl}/track`, fullInteraction)
      .pipe(
        catchError(error => {
          console.error('Error tracking interaction:', error);
          return of({ success: 'false', message: 'Failed to track interaction', error: error.message });
        })
      );
  }

  // Batch Tracking (for performance)
  addToBatch(interaction: Partial<InteractionTrackingRequest>): void {
    if (!this.consentStatus.value) return;

    const fullInteraction: InteractionTrackingRequest = {
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      deviceType: this.detectDeviceType(),
      browserName: this.detectBrowserName(),
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      ...interaction
    } as InteractionTrackingRequest;

    this.pendingInteractions.push(fullInteraction);

    // Send batch if it reaches the limit
    if (this.pendingInteractions.length >= this.BATCH_SIZE) {
      this.sendBatch();
    } else {
      // Set timer to send batch after timeout
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
      }
      this.batchTimer = setTimeout(() => this.sendBatch(), this.BATCH_TIMEOUT);
    }
  }

  private sendBatch(): void {
    if (this.pendingInteractions.length === 0) return;

    const request: BatchTrackingRequest = {
      interactions: [...this.pendingInteractions]
    };

    this.pendingInteractions = [];
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    this.http.post<BatchTrackingResponse>(`${this.baseUrl}/track/batch`, request)
      .pipe(
        catchError(error => {
          console.error('Error in batch tracking:', error);
          return of({ success: false, processed: 0, successful: 0, failed: request.interactions.length });
        })
      )
      .subscribe(response => {
        if (response.failed > 0) {
          console.warn(`Batch tracking: ${response.failed} interactions failed`);
        }
      });
  }

  // Force send any pending interactions
  flushBatch(): void {
    this.sendBatch();
  }

  // Analytics (Admin/Gestionnaire only)
  getFormationAnalytics(formationId: number, startDate?: string, endDate?: string): Observable<AnalyticsResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<AnalyticsResponse>(`${this.baseUrl}/analytics/formation/${formationId}`, { params })
      .pipe(
        catchError(error => {
          console.error('Error getting formation analytics:', error);
          return of({ error: 'Failed to get formation analytics' });
        })
      );
  }

  getCategoryAnalytics(categoryId: number, startDate?: string, endDate?: string): Observable<AnalyticsResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<AnalyticsResponse>(`${this.baseUrl}/analytics/category/${categoryId}`, { params })
      .pipe(
        catchError(error => {
          console.error('Error getting category analytics:', error);
          return of({ error: 'Failed to get category analytics' });
        })
      );
  }

  getDashboardStats(startDate?: string, endDate?: string): Observable<AnalyticsResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<AnalyticsResponse>(`${this.baseUrl}/analytics/dashboard`, { params })
      .pipe(
        catchError(error => {
          console.error('Error getting dashboard stats:', error);
          return of({ error: 'Failed to get dashboard stats' });
        })
      );
  }

  getPopularFormations(limit: number = 10): Observable<any[]> {
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<any[]>(`${this.baseUrl}/analytics/popular-formations`, { params })
      .pipe(
        catchError(error => {
          console.error('Error getting popular formations:', error);
          return of([]);
        })
      );
  }

  // Utility Methods
  private detectDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('mobile') || userAgent.includes('android') || 
        userAgent.includes('iphone') || userAgent.includes('ipod')) {
      return 'mobile';
    }
    
    if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
      return 'tablet';
    }
    
    return 'desktop';
  }

  private detectBrowserName(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
    if (userAgent.includes('edge')) return 'edge';
    if (userAgent.includes('opera')) return 'opera';
    if (userAgent.includes('trident') || userAgent.includes('msie')) return 'ie';
    
    return 'other';
  }

  // Convenience methods for common tracking scenarios
  trackPageView(formationId?: number, categoryId?: number): void {
    this.addToBatch({
      actionType: 'page_view',
      formationId,
      categoryId
    });
  }

  trackClick(elementId: string, elementType: string, x?: number, y?: number, formationId?: number, categoryId?: number): void {
    this.addToBatch({
      actionType: 'click',
      elementId,
      elementType,
      xCoordinate: x,
      yCoordinate: y,
      formationId,
      categoryId
    });
  }

  trackHover(elementId: string, elementType: string, formationId?: number, categoryId?: number): void {
    this.addToBatch({
      actionType: 'hover',
      elementId,
      elementType,
      formationId,
      categoryId
    });
  }

  trackScroll(scrollPosition: number, formationId?: number, categoryId?: number): void {
    this.addToBatch({
      actionType: 'scroll',
      yCoordinate: scrollPosition,
      formationId,
      categoryId
    });
  }

  // Cleanup
  ngOnDestroy(): void {
    this.flushBatch();
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
  }
}