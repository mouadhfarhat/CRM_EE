import { Component, OnInit } from '@angular/core';
import { Client } from '../../domains/client';
import { Formation } from '../../domains/formation';
import { ClientService } from '../../services/client/client.service';
import { FormationService } from '../../services/formation/formation.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientGroupService } from '../../services/cleint-group/client-group.service';
import { ClientGroup } from '../../domains/clients-group.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-client-gestionnaire',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterLink],
  providers: [ClientService, FormationService, ClientGroupService],
  templateUrl: './client-gestionnaire.component.html',
  styleUrl: './client-gestionnaire.component.css'
})
export class ClientGestionnaireComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];

  formations: Formation[] = [];
  filteredFormations: Formation[] = [];

  groups: ClientGroup[] = [];
  filteredGroups: ClientGroup[] = [];

  formationSearchTerm = '';
  usernameSearchTerm = '';
  groupSearchTerm = '';

  selectedFormationId!: number | null;
  selectedGroupId!: number | null;
  demandeType!: string;

  showFormationDropdown = false;
  showGroupDropdown = false;
  imageCache: { [key: number]: SafeUrl } = {}; // cache for performance
  

  constructor(
    private clientService: ClientService,
    private formationService: FormationService,
    private groupService: ClientGroupService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAllClients();
    this.loadFormations();
    this.loadGroups();
  }

selectFormation(formation: Formation | null): void {
  if (!formation) {
    this.formationSearchTerm = '';
    this.selectedFormationId = null;
    this.loadAllClients();
    return;
  }

  this.formationSearchTerm = formation.title;
  this.selectedFormationId = formation.id!;
  this.showFormationDropdown = false;

  this.clientService.getClientsInterestedInFormation(this.selectedFormationId).subscribe({
    next: (data: Client[]) => {
      this.clients = data;
      this.filteredClients = data;
      this.updatePagination();
    },
    error: (err) => {
      console.error('Error loading clients interested in formation', err);
      this.clients = [];
      this.filteredClients = [];
    }
  });
}



  loadAllClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        this.updatePagination();
      },
      error: (err) => console.error('Error fetching clients', err)
    });
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe(data => {
      this.formations = data;
      this.filteredFormations = data;
    });
  }

  loadGroups(): void {
    this.groupService.getAll().subscribe(data => {
      this.groups = data;
      this.filteredGroups = data;
    });
  }

  // Show dropdown
  onFormationSearch(): void {
    this.showFormationDropdown = true;
    if (this.formationSearchTerm.length < 2) {
      this.filteredFormations = this.formations;
    } else {
      this.filteredFormations = this.formations.filter(f =>
        f.title.toLowerCase().includes(this.formationSearchTerm.toLowerCase())
      );
    }
  }



  toggleGroupDropdown(): void {
    this.showGroupDropdown = !this.showGroupDropdown;
  }
/*
  selectGroup(group: ClientGroup): void {
    this.groupSearchTerm = group.name;
    this.selectedGroupId = group.id!;
    this.showGroupDropdown = false;
  }
*/
  // Master search function
searchClients(): void {
  let filtered = [...this.clients];

  if (this.usernameSearchTerm) {
    filtered = filtered.filter(client =>
      client.username.toLowerCase().includes(this.usernameSearchTerm.toLowerCase())
    );
  }

  if (this.selectedFormationId) {
    filtered = filtered.filter(client =>
      client.interested?.some(f => f.id === this.selectedFormationId)
    );
  }

  // Removed group and demandeType filters from here
  this.filteredClients = filtered;
}

selectGroup(group: ClientGroup): void {
  if (this.selectedGroupId === group.id) {
    // Deselect group
    this.selectedGroupId = null;
    this.loadAllClients(); // Reload full list
  } else {
    // Select and load clients for group
    this.selectedGroupId = group.id;
    this.clientService.getByGroup(group.id).subscribe((data: Client[]) => {
      this.clients = data;            // Update base list
      this.filteredClients = data;   // And visible list
      this.updatePagination(); 
    });
  }

  console.log('Selected Group ID:', this.selectedGroupId);
}



  getInterests(client: Client): string {
    return client.interested?.length ? client.interested.map(f => f.title).join(', ') : 'No interests listed';
  }

  selectedClients: Client[] = [];

  onClientSelectionChange(): void {
    this.selectedClients = this.filteredClients.filter(c => c.selected);
  }

  sendBulkEmail(): void {
    const emails = this.selectedClients.map(c => c.email).join(',');
    window.location.href = `mailto:${emails}`;
  }

  sendBulkSMS(): void {
    const phones = this.selectedClients.map(c => c.phoneNumber).join(',');
    window.location.href = `sms:${phones}`;
  }


    getClientImage(client: any): SafeUrl {
    // If already cached
    if (this.imageCache[client.id]) return this.imageCache[client.id];
  
    const imageUrl = client.imageUrl
      ? `http://localhost:8080${client.imageUrl}?t=${new Date().getTime()}`
      : `http://localhost:8080/images/users/default.png`;
  
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.imageCache[client.id] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  
    return `assets/loading.gif`; // temporary placeholder while loading
  } 



  // Pagination variables
currentPage: number = 1;
pageSize: number = 6; // Number of clients per page
totalPages: number = 0;

get paginatedClients(): Client[] {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredClients.slice(start, end);
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

updatePagination(): void {
  this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
  this.currentPage = 1; // reset to first page
}

}
