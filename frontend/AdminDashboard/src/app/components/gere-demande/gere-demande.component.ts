import { Component, OnInit } from '@angular/core';
import { Demande } from '../../domains/demande.model';
import { DemandeService } from '../../services/demande/demande.service';
import { CommonModule } from '@angular/common';
import {  HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DemandeStatut, DemandeType } from '../../domains/enums';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-gere-demande',
  imports: [ ToolbarModule,HttpClientModule,CommonModule,FormsModule],
  providers: [DemandeService],
  templateUrl: './gere-demande.component.html',
  styleUrl: './gere-demande.component.css',
  standalone:true
})
export class GereDemandeComponent implements OnInit {
  demandes: Demande[] = [];

  demandesEnAttente: Demande[] = [];
  demandesEnCours: Demande[] = [];
  demandesTermine: Demande[] = [];
  demandesRefuse: Demande[] = [];

  allGestionnaires: any[] = [];
  selectedGestionnaireId: number | null = null;
  selectedDemandeId: number | null = null;
  showModal = false;
  showDetailsModal = false;
  selectedDemande: Demande | null = null;
  
  maxDescriptionLength = 100;
  expandedDemandes: {[key: number]: boolean} = {};

  constructor(
    private demandeService: DemandeService,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    const gestionnaireId = 5; // or get this dynamically
    this.loadDemandes(gestionnaireId);
    this.loadGestionnaires();
  }

  loadDemandes(gestionnaireId: number) {
    this.demandeService.getDemandesByGestionnaireId(gestionnaireId).subscribe(
      (data) => {
        this.demandes = data;
        this.categorizeDemandes();
      },
      (error) => {
        console.error("Error loading demandes", error);
      }
    );
  }

  categorizeDemandes() {
    const addShowDetails = (d: Demande) => ({ ...d, showDetails: false });
  
    this.demandesEnAttente = this.demandes
      .filter(d => d.statut === DemandeStatut.EN_ATTENTE)
      .map(addShowDetails);
  
    this.demandesEnCours = this.demandes
      .filter(d => d.statut === DemandeStatut.EN_COURS)
      .map(addShowDetails);
  
    this.demandesTermine = this.demandes
      .filter(d => d.statut === DemandeStatut.TERMINE)
      .map(addShowDetails);
  
    this.demandesRefuse = this.demandes
      .filter(d => d.statut === DemandeStatut.REFUSE)
      .map(addShowDetails);
  }
  

  changeStatus(demandeId: number, newStatus: string) {
    const gestionnaireId = 5; // or get this dynamically
    this.demandeService.updateDemandeStatus(demandeId, newStatus, gestionnaireId).subscribe(
      () => {
        this.updateLocalDemandes(demandeId, newStatus);
      },
      (error) => {
        console.error("Error updating demande status", error);
      }
    );
  }

  private updateLocalDemandes(demandeId: number, newStatus: string) {
    const allDemandes = [
      ...this.demandesEnAttente,
      ...this.demandesEnCours,
      ...this.demandesTermine,
      ...this.demandesRefuse
    ];

    const demandeToUpdate = allDemandes.find(d => d.id === demandeId);

    if (demandeToUpdate) {
      const oldStatus = demandeToUpdate.statut;

      const newStatusEnum = DemandeStatut[newStatus as keyof typeof DemandeStatut];
      demandeToUpdate.statut = newStatusEnum;

      this.removeFromArray(demandeId, oldStatus);
      this.addToArray(demandeToUpdate, newStatusEnum);

      // ✅ Force Angular to detect changes
      this.demandesEnAttente = [...this.demandesEnAttente];
      this.demandesEnCours = [...this.demandesEnCours];
      this.demandesTermine = [...this.demandesTermine];
      this.demandesRefuse = [...this.demandesRefuse];
    }
  }

  private removeFromArray(demandeId: number, status: DemandeStatut) {
    switch (status) {
      case DemandeStatut.EN_ATTENTE:
        this.demandesEnAttente = this.demandesEnAttente.filter(d => d.id !== demandeId);
        break;
      case DemandeStatut.EN_COURS:
        this.demandesEnCours = this.demandesEnCours.filter(d => d.id !== demandeId);
        break;
      case DemandeStatut.TERMINE:
        this.demandesTermine = this.demandesTermine.filter(d => d.id !== demandeId);
        break;
      case DemandeStatut.REFUSE:
        this.demandesRefuse = this.demandesRefuse.filter(d => d.id !== demandeId);
        break;
    }
  }

  private addToArray(demande: Demande, status: DemandeStatut) {
    switch (status) {
      case DemandeStatut.EN_ATTENTE:
        this.demandesEnAttente.push(demande);
        break;
      case DemandeStatut.EN_COURS:
        this.demandesEnCours.push(demande);
        break;
      case DemandeStatut.TERMINE:
        this.demandesTermine.push(demande);
        break;
      case DemandeStatut.REFUSE:
        this.demandesRefuse.push(demande);
        break;
    }
  }

  loadGestionnaires() {
    this.http.get<any[]>('http://localhost:8080/gestionnaires').subscribe(data => {
      this.allGestionnaires = data;
    });
  }

  openShareModal(demande: any) {
    this.selectedDemandeId = demande.id;
    this.showModal = true;
  }

  closeModal() {
    this.selectedDemandeId = null;
    this.selectedGestionnaireId = null;
    this.showModal = false;
  }

  shareDemande() {
    if (!this.selectedDemandeId || !this.selectedGestionnaireId) return;

    const url = `http://localhost:8080/demandes/${this.selectedDemandeId}/share/${this.selectedGestionnaireId}`;
    this.http.put(url, {}).subscribe({
      next: () => {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert" 
               style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <strong><i class="fas fa-check-circle me-2"></i>Success!</strong>
            <span>The demande has been shared successfully.</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        
        // Add to DOM
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
          alertDiv.remove();
          this.closeModal();
        }, 800);
      },
      error: err => {
        console.error('Error sharing demande', err);
        alert('Failed to share demande.');
      }
    });
  }

  openDemandeDetails(demande: Demande) {
    this.selectedDemande = demande;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.selectedDemande = null;
    this.showDetailsModal = false;
  }

  toggleDescription(demandeId: number): void {
    this.expandedDemandes[demandeId] = !this.expandedDemandes[demandeId];
  }

  isExpanded(demandeId: number): boolean {
    return this.expandedDemandes[demandeId];
  }

  // Add to your component class
searchParams = {
  title: '',
  description: '',
  clientName: '',
  statut: null as DemandeStatut | null,
  type: null as DemandeType | null
};

statutOptions = Object.values(DemandeStatut);
typeOptions = Object.values(DemandeType);
isSearching = false;

searchDemandes(): void {
  this.isSearching = true;
  const gestionnaireId = this.getGestionnaireId(); // Get from auth service or state
  
  this.demandeService.searchDemandesByGestionnaire(
    gestionnaireId,
    this.searchParams.title.trim(),
    this.searchParams.description.trim(),
    this.searchParams.clientName.trim(),
    this.searchParams.statut || undefined,
    this.searchParams.type || undefined
  ).subscribe({
    next: (data) => {
      this.demandes = data;
      this.categorizeDemandes();
      this.isSearching = false;
    },
    error: (error) => {
      console.error('Search failed:', error);
      this.isSearching = false;
      // Show error toast/notification
    }
  });
}

resetSearch(): void {
  this.searchParams = {
    title: '',
    description: '',
    clientName: '',
    statut: null,
    type: null
  };
  const gestionnaireId = this.getGestionnaireId();
  this.loadDemandes(gestionnaireId);
}

private getGestionnaireId(): number {
  // Implement your logic to get the current gestionnaire ID
  // Example: return this.authService.currentUser.id;
  return 5; // Temporary - replace with actual implementation
}




}
