
import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../domains/client';
import { ClientService } from '../../../../services/client/client.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [HttpClientModule,CommonModule,FormsModule,RouterLink],
  providers: [ClientService],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {



  clients: Client[] = [];

  // Form search fields
  formationSearchTerm = '';
  selectedFormationId!: number;

  demandeType!: string;

  constructor(
    private clientService: ClientService,
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

