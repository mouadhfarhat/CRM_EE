import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeatmapTrackingService } from '../../../services/HeatMap/HeatmapTracking.service';

@Component({
  selector: 'app-consent-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="consent-container" *ngIf="showConsentBanner">
      <div class="consent-banner">
        <div class="consent-content">
          <h3>🍪 Gestion des Données de Suivi</h3>
          <p class="consent-description">
            Nous utilisons des technologies de suivi pour améliorer votre expérience et analyser l'utilisation de notre plateforme de formation.
            Vous pouvez choisir les types de données que vous acceptez de partager.
          </p>
          
          <div class="consent-options">
            <div class="data-type-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="consentOptions.pageViews"
                  class="consent-checkbox">
                <span class="checkmark"></span>
                <div class="option-info">
                  <strong>Vues de pages</strong>
                  <small>Nous permet de voir quelles formations vous intéressent</small>
                </div>
              </label>
            </div>

            <div class="data-type-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="consentOptions.interactions"
                  class="consent-checkbox">
                <span class="checkmark"></span>
                <div class="option-info">
                  <strong>Interactions</strong>
                  <small>Clics et navigation pour améliorer l'interface</small>
                </div>
              </label>
            </div>

            <div class="data-type-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="consentOptions.analytics"
                  class="consent-checkbox">
                <span class="checkmark"></span>
                <div class="option-info">
                  <strong>Analyses statistiques</strong>
                  <small>Données agrégées pour les statistiques générales</small>
                </div>
              </label>
            </div>

            <div class="data-type-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="consentOptions.heatmaps"
                  class="consent-checkbox">
                <span class="checkmark"></span>
                <div class="option-info">
                  <strong>Cartes de chaleur</strong>
                  <small>Position des clics pour optimiser l'interface</small>
                </div>
              </label>
            </div>
          </div>

          <div class="consent-actions">
            <button 
              class="btn btn-secondary" 
              (click)="rejectAll()"
              [disabled]="isLoading">
              Tout Refuser
            </button>
            <button 
              class="btn btn-primary" 
              (click)="acceptSelected()"
              [disabled]="isLoading || !hasAnySelection()">
              <span *ngIf="isLoading" class="spinner"></span>
              Accepter la Sélection
            </button>
            <button 
              class="btn btn-success" 
              (click)="acceptAll()"
              [disabled]="isLoading">
              Tout Accepter
            </button>
          </div>

          <div class="consent-footer">
            <small>
              Vous pouvez modifier vos préférences à tout moment dans les paramètres.
              <a href="#" (click)="showDetails = !showDetails">En savoir plus</a>
            </small>
          </div>

          <div class="consent-details" *ngIf="showDetails">
            <h4>Détails sur l'utilisation des données</h4>
            <ul>
              <li><strong>Vues de pages:</strong> URL visitées, temps passé, référent</li>
              <li><strong>Interactions:</strong> Éléments cliqués, coordonnées de clic</li>
              <li><strong>Analytics:</strong> Statistiques de fréquentation anonymisées</li>
              <li><strong>Heatmaps:</strong> Zones d'interaction pour l'optimisation UX</li>
            </ul>
            <p><small>Toutes les données sont anonymisées et utilisées uniquement pour améliorer notre service.</small></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Consent Status Indicator -->
    <div class="consent-status" *ngIf="!showConsentBanner">
      <div class="status-indicator" [class.active]="hasConsent">
        <span class="status-icon">{{ hasConsent ? '✓' : '✗' }}</span>
        <span class="status-text">
          {{ hasConsent ? 'Suivi activé' : 'Suivi désactivé' }}
        </span>
        <button class="btn btn-sm btn-outline" (click)="showConsentManagement()">
          Gérer
        </button>
      </div>
    </div>

    <!-- Consent Management Modal -->
    <div class="modal-overlay" *ngIf="showManagementModal" (click)="closeManagement()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Gestion du Consentement</h3>
          <button class="close-btn" (click)="closeManagement()">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="current-status">
            <h4>Statut Actuel</h4>
            <p class="status-text" [class.consent-granted]="hasConsent" [class.consent-denied]="!hasConsent">
              {{ hasConsent ? 'Vous avez accordé votre consentement au suivi' : 'Vous n\'avez pas accordé de consentement' }}
            </p>
          </div>

          <div class="consent-options" *ngIf="hasConsent">
            <h4>Types de données autorisées</h4>
            <div class="active-consents">
              <span class="consent-tag" *ngFor="let type of activeConsentTypes">
                {{ getConsentTypeLabel(type) }}
              </span>
            </div>
          </div>

          <div class="management-actions">
            <button 
              class="btn btn-primary" 
              (click)="modifyConsent()"
              *ngIf="hasConsent">
              Modifier les Préférences
            </button>
            <button 
              class="btn btn-success" 
              (click)="grantConsent()"
              *ngIf="!hasConsent">
              Accorder le Consentement
            </button>
            <button 
              class="btn btn-danger" 
              (click)="withdrawConsent()"
              *ngIf="hasConsent"
              [disabled]="isLoading">
              <span *ngIf="isLoading" class="spinner"></span>
              Retirer le Consentement
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" *ngIf="isLoading">
      <div class="loading-spinner"></div>
    </div>
  `,
  styles: [`
    .consent-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    }

    .consent-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
    }

    .consent-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .consent-content h3 {
      margin: 0 0 16px 0;
      font-size: 1.5em;
      font-weight: 600;
    }

    .consent-description {
      margin-bottom: 24px;
      font-size: 1.1em;
      line-height: 1.6;
      opacity: 0.95;
    }

    .consent-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .data-type-group {
      background: rgba(255, 255, 255, 0.1);
      padding: 16px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      gap: 12px;
    }

    .consent-checkbox {
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .option-info {
      flex: 1;
    }

    .option-info strong {
      display: block;
      margin-bottom: 4px;
      font-size: 1.1em;
    }

    .option-info small {
      opacity: 0.8;
      font-size: 0.9em;
      line-height: 1.4;
    }

    .consent-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 16px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
      justify-content: center;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4338ca;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-2px);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
    }

    .consent-footer {
      text-align: center;
      opacity: 0.8;
    }

    .consent-footer a {
      color: white;
      text-decoration: underline;
      cursor: pointer;
    }

    .consent-details {
      margin-top: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .consent-details h4 {
      margin-bottom: 12px;
      font-size: 1.2em;
    }

    .consent-details ul {
      margin: 12px 0;
      padding-left: 20px;
    }

    .consent-details li {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .consent-status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999;
    }

    .status-indicator {
      background: white;
      padding: 12px 16px;
      border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      border: 2px solid #e5e7eb;
    }

    .status-indicator.active {
      border-color: #10b981;
      background: #f0fdf4;
    }

    .status-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .status-indicator.active .status-icon {
      background: #10b981;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
    }

    .modal-body {
      padding: 24px;
    }

    .current-status {
      margin-bottom: 24px;
    }

    .status-text.consent-granted {
      color: #10b981;
    }

    .status-text.consent-denied {
      color: #ef4444;
    }

    .consent-tag {
      display: inline-block;
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.9em;
      margin: 4px 8px 4px 0;
    }

    .management-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1002;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #4f46e5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .consent-content {
        padding: 0 16px;
      }
      
      .consent-options {
        grid-template-columns: 1fr;
      }
      
      .consent-actions {
        flex-direction: column;
      }
      
      .modal-content {
        width: 95%;
        margin: 20px;
      }
    }
  `]
})
export class ConsentManagementComponent implements OnInit {
  showConsentBanner = false;
  showManagementModal = false;
  showDetails = false;
  hasConsent = false;
  isLoading = false;
  activeConsentTypes: string[] = [];

  consentOptions = {
    pageViews: true,
    interactions: true,
    analytics: false,
    heatmaps: false
  };

  private consentTypeLabels = {
    'page_views': 'Vues de pages',
    'interactions': 'Interactions',
    'analytics': 'Analyses statistiques',
    'heatmaps': 'Cartes de chaleur'
  };

  constructor(private HeatmapTrackingService: HeatmapTrackingService) {}

  ngOnInit() {
    this.checkInitialConsentStatus();
  }

  private checkInitialConsentStatus() {
    this.HeatmapTrackingService.getConsentStatus().subscribe(hasConsent => {
      this.hasConsent = hasConsent;
      if (!hasConsent && !this.hasShownConsentBanner()) {
        this.showConsentBanner = true;
        this.markConsentBannerShown();
      }
    });
  }

  private hasShownConsentBanner(): boolean {
    return localStorage.getItem('consent_banner_shown') === 'true';
  }

  private markConsentBannerShown() {
    localStorage.setItem('consent_banner_shown', 'true');
  }

  hasAnySelection(): boolean {
    return Object.values(this.consentOptions).some(value => value);
  }

  acceptAll() {
    this.consentOptions = {
      pageViews: true,
      interactions: true,
      analytics: true,
      heatmaps: true
    };
    this.acceptSelected();
  }

  rejectAll() {
    this.consentOptions = {
      pageViews: false,
      interactions: false,
      analytics: false,
      heatmaps: false
    };
    this.showConsentBanner = false;
  }

  acceptSelected() {
    const consentedTypes = this.getSelectedConsentTypes();
    if (consentedTypes.length === 0) return;

    this.isLoading = true;
    this.HeatmapTrackingService.recordConsent(consentedTypes).subscribe({
      next: (response) => {
        this.hasConsent = true;
        this.activeConsentTypes = consentedTypes;
        this.showConsentBanner = false;
        this.isLoading = false;
        console.log('Consent recorded successfully', response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to record consent', error);
        alert('Erreur lors de l\'enregistrement du consentement');
      }
    });
  }

  private getSelectedConsentTypes(): string[] {
    const types: string[] = [];
    if (this.consentOptions.pageViews) types.push('page_views');
    if (this.consentOptions.interactions) types.push('interactions');
    if (this.consentOptions.analytics) types.push('analytics');
    if (this.consentOptions.heatmaps) types.push('heatmaps');
    return types;
  }

  withdrawConsent() {
    this.isLoading = true;
    this.HeatmapTrackingService.withdrawConsent().subscribe({
      next: (response) => {
        this.hasConsent = false;
        this.activeConsentTypes = [];
        this.showManagementModal = false;
        this.isLoading = false;
        console.log('Consent withdrawn successfully', response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to withdraw consent', error);
        alert('Erreur lors du retrait du consentement');
      }
    });
  }

  showConsentManagement() {
    this.showManagementModal = true;
  }

  closeManagement() {
    this.showManagementModal = false;
  }

  grantConsent() {
    this.showManagementModal = false;
    this.showConsentBanner = true;
  }

  modifyConsent() {
    this.showManagementModal = false;
    this.showConsentBanner = true;
  }

  getConsentTypeLabel(type: string): string {
    return this.consentTypeLabels[type as keyof typeof this.consentTypeLabels] || type;
  }
}