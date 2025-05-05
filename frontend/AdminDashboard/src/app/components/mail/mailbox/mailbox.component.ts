import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Demande } from '../../../domains/demande.model';
import { DemandeService } from '../../../services/demande/demande.service';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';


@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule]
})
export class MailboxComponent implements OnInit {
  currentFolder: string = 'inbox';
  selectAll = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  demands: Demande[] = [];

  constructor(
    private demandeService: DemandeService,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        this.loadUnassignedDemands();
      } else {
        console.error('User not logged in');
        await this.keycloakService.login();
      }
    } catch (error) {
      console.error('Keycloak initialization error:', error);
    }
  }

  loadUnassignedDemands(): void {
    this.demandeService.getUnassignedDemandes().subscribe({
      next: (demands) => {
        this.demands = demands.map(demand => ({
          ...demand,
          selected: false
        }));
        this.totalItems = demands.length;
      },
      error: (err) => console.error('Error fetching demands:', err)
    });
  }

  assignDemande(demandeId: number): void {
    this.demandeService.assignDemande(demandeId).subscribe({
      next: () => {
        this.loadUnassignedDemands();
        alert('Demande assigned successfully');
      },
      error: (err) => console.error('Error assigning demande:', err)
    });
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.demands = this.demands.map(demand => ({
      ...demand,
      selected: this.selectAll
    }));
  }

  deleteSelected(): void {
    this.demands = this.demands.filter(demand => !demand.selected);
  }

  refreshDemands(): void {
    this.loadUnassignedDemands();
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
    }
  }

  get paginationText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}/${this.totalItems}`;
  }
}