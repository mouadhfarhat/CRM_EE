import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // <-- ✅ Import this
import { Demande } from '../../domains/demande.model';
import { DemandeService } from '../../services/demande/demande.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DemandeStatut, DemandeType } from '../../domains/enums';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demande-mang',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule], // <-- ✅ Add RouterModule here
  templateUrl: './demande-mang.component.html',
  styleUrls: ['./demande-mang.component.css'],
})
export class DemandeMangComponent implements OnInit {
  demandes: Demande[] = [];
  gestionnaireImageMap: { [key: string]: SafeUrl } = {};
  defaultUserImage = 'http://localhost:8080/images/users/default.png';
  searchTitle: string = '';
  searchDescription: string = '';
  searchClientName: string = '';
  searchStatut?: DemandeStatut;
  searchType?: DemandeType;

  constructor(
    private demandeService: DemandeService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  // Existing method
  loadDemandes(): void {
    this.demandeService.getAllDemandes().subscribe({
      next: (data) => {
        this.demandes = data;
        this.demandes.forEach((demande) => {
          const assignedKeycloakId = demande.gestionnaireAssigne?.keycloakId;
          const sharedKeycloakId = demande.sharedWith?.keycloakId;
          if (assignedKeycloakId) this.loadGestionnaireImage(assignedKeycloakId);
          if (sharedKeycloakId) this.loadGestionnaireImage(sharedKeycloakId);
        });
      },
      error: (err) => console.error('Error loading demandes', err),
    });
  }

  // New search method
  searchDemandes(): void {
    this.demandeService.searchDemandes(
      this.searchTitle,
      this.searchDescription,
      this.searchClientName,
      this.searchStatut,
      this.searchType
    ).subscribe({
      next: (data) => this.demandes = data,
      error: (err) => console.error('Error searching demandes', err)
    });
  }

  loadGestionnaireImage(gestionnaireKeycloakId: string): void {
    if (this.gestionnaireImageMap[gestionnaireKeycloakId]) return;

    this.http.get<any>(`http://localhost:8080/api/users/${gestionnaireKeycloakId}`).subscribe({
      next: (user) => {
        let imageUrl = user.imageUrl;
        if (!imageUrl || imageUrl === 'default.png') {
          imageUrl = this.defaultUserImage;
        } else if (!imageUrl.startsWith('http')) {
          imageUrl = `http://localhost:8080${imageUrl}`;
        }
        imageUrl += `?t=${Date.now()}`;
        this.http.get(imageUrl, { responseType: 'blob' }).subscribe({
          next: (blob) => {
            const objectURL = URL.createObjectURL(blob);
            this.gestionnaireImageMap[gestionnaireKeycloakId] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error: () => this.setDefaultImage(gestionnaireKeycloakId),
        });
      },
      error: () => this.setDefaultImage(gestionnaireKeycloakId),
    });
  }

  setDefaultImage(gestionnaireKeycloakId: string): void {
    this.http.get(this.defaultUserImage, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.gestionnaireImageMap[gestionnaireKeycloakId] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.gestionnaireImageMap[gestionnaireKeycloakId] = '';
      },
    });
  }

  deleteDemande(id: number): void {
    if (confirm('Are you sure you want to delete this demande?')) {
      this.demandeService.deleteDemande(id).subscribe(() => this.loadDemandes());
    }
  }
}
