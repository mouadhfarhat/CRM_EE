import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../../../../domains/client';
import { ClientService } from '../../../../services/client/client.service';
import { DragDropModule } from 'primeng/dragdrop';

@Component({
  selector: 'app-list-client-group',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterLink, DragDropModule],
  providers: [ClientService],
  templateUrl: './list-client-group.component.html',
  styleUrl: './list-client-group.component.css'
})
export class ListClientGroupComponent implements OnInit {
  allClients: Client[] = [];
  @Input() assignedClientIds: number[] = [];
  @Output() dragClientEvent = new EventEmitter<Client>();
  
  // Track which client is being dragged
  draggedClient: Client | null = null;

  // Form search fields
  formationSearchTerm = '';
  selectedFormationId!: number;

  constructor(
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.loadAllClients();
  }

  // Getter to filter out assigned clients
  get clients(): Client[] {
    return this.allClients.filter(client => 
      !this.assignedClientIds.includes(client.id)
    );
  }

  loadAllClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.allClients = data,
      error: (err) => console.error('Error fetching clients', err)
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
  
  // Drag and Drop functionality
  dragStart(client: Client): void {
    this.draggedClient = client;
    this.dragClientEvent.emit(client);
  }
  
  dragEnd(): void {
    this.draggedClient = null;
  }
}