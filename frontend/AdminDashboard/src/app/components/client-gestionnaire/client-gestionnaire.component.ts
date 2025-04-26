import { Component, OnInit } from '@angular/core';
import { Client } from '../../domains/client';
import { Formation } from '../../domains/formation';
import { ClientService } from '../../services/client/client.service';
import { FormationService } from '../../services/formation/formation.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-gestionnaire',
  standalone: true,
  imports: [HttpClientModule,CommonModule,FormsModule,RouterLink],
    providers: [ClientService,FormationService],
  
  templateUrl: './client-gestionnaire.component.html',
  styleUrl: './client-gestionnaire.component.css'
})
export class ClientGestionnaireComponent implements OnInit {
  clients: Client[] = [];

  // Form search fields
  formationSearchTerm = '';
  selectedFormationId!: number;
  filteredFormations: Formation[] = [];

  demandeType!: string;

  constructor(
    private clientService: ClientService,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    this.loadAllClients();
  }

  loadAllClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Error fetching clients', err)
    });
  }

  onFormationSearch(): void {
    console.log('Search input:', this.formationSearchTerm);
  
    if (this.formationSearchTerm.length < 2) {
      this.filteredFormations = [];
      return;
    }
  
    this.formationService.searchFormations(this.formationSearchTerm).subscribe({
      next: (formations) => {
        console.log('Found formations:', formations);
        this.filteredFormations = formations;
      },
      error: (err) => console.error('Error searching formations', err)
    });
  }
  

  selectFormation(formation: Formation): void {
    this.formationSearchTerm = formation.title;
    this.selectedFormationId = formation.id;
    this.filteredFormations = [];
  }

  searchClients(): void {
    if (!this.selectedFormationId || !this.demandeType) {
      alert("Please select a formation and a demande type.");
      return;
    }

    this.clientService.searchClientsByFormationAndType(this.selectedFormationId, this.demandeType).subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Search failed', err)
    });
  }

  getInterests(client: Client): string {
    return client.interested?.length ? client.interested.map(f => f.title).join(', ') : 'No interests listed';
  }




  selectedClients: Client[] = [];

onClientSelectionChange(): void {
  this.selectedClients = this.clients.filter(c => c.selected);
}


sendBulkEmail(): void {
  const emails = this.selectedClients.map(c => c.email).join(',');
  window.location.href = `mailto:${emails}`;
}

sendBulkSMS(): void {
  const phones = this.selectedClients.map(c => c.phoneNumber).join(',');
  window.location.href = `sms:${phones}`;
}


}
