import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import * as Papa from 'papaparse';  
import { ConfirmationService, MessageService } from 'primeng/api';
import { Formation } from '../../domains/formation';
import { Client } from '../../domains/client';
import { ClientService } from '../../services/client/client.service';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-client-mang',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, ClientService],
  templateUrl: './client-mang.component.html',
  styleUrl: './client-mang.component.css',
  styles: [
    `:host ::ng-deep .p-dialog .client-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ]
})
export class ClientMangComponent {
  @ViewChild('dt') dt!: Table;
  @ViewChild('fileInput') fileInput: any;
  
  clientDialog: boolean = false;
  clients: Client[] = []; 
  client: Client = {} as Client;
  selectedClients!: Client[] | null;
  submitted: boolean = false;
  roles: any[] = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
    { label: 'Gestionnaire', value: 'gestionnaire' }
  ];

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.clientService.getClients().then((data) => (this.clients = data));
  }

// Trigger the file input when the Import button is clicked
triggerFileInput() {
  this.fileInput.nativeElement.click();
}

// Handle file import (CSV)
importCSV(event: any) {
  const file = event.target.files[0];

  if (file) {
    Papa.parse(file, {
      complete: (result) => {
        const clients = result.data;
        this.addClients(clients);
      },
      header: true,
      skipEmptyLines: true
    });
  }
}

// Function to add clients to your client list
addClients(clients: any[]) {
  clients.forEach(csvClient => {
    const existingClient = this.clients.find(c => c.id === csvClient.id);

    if (existingClient) {
      // Update existing client
      existingClient.username = csvClient.username || existingClient.username;
      existingClient.email = csvClient.email || existingClient.email;
      existingClient.password = csvClient.password || existingClient.password;
      existingClient.role = this.validateRole(csvClient.role) || existingClient.role;
      existingClient.domaine = csvClient.domaine || existingClient.domaine;
      existingClient.certifications = csvClient.certifications || existingClient.certifications;
      existingClient.image = csvClient.image || existingClient.image;
      
      // Handle formation arrays
      existingClient.history = this.parseFormations(csvClient.history) || existingClient.history;
      existingClient.favorites = this.parseFormations(csvClient.favorites) || existingClient.favorites;
    } else {
      // Add new client
      this.clients.push({
        id: csvClient.id || this.createId(),
        username: csvClient.username || '',
        email: csvClient.email || '',
        password: csvClient.password || '',
        role: this.validateRole(csvClient.role) || 'user',
        domaine: csvClient.domaine || '',
        certifications: csvClient.certifications || '',
        image: csvClient.image || 'client-placeholder.svg',
        history: this.parseFormations(csvClient.history) || [],
        favorites: this.parseFormations(csvClient.favorites) || []
      });
    }
  });

  this.clients = [...this.clients];
  this.messageService.add({
    severity: 'success', 
    summary: 'Import Successful', 
    detail: `${clients.length} clients processed`, 
    life: 3000
  });
}

private validateRole(role: string): string {
  const validRoles = ['user', 'admin', 'gestionnaire'];
  return validRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : 'user';
}

private parseFormations(data: any): Formation[] {
  if (typeof data === 'string') {
    return data.split(';').map((id: string) => ({ id: id.trim() } as Formation));
  }
  return Array.isArray(data) ? data : [];
}
  // Export clients to CSV
  exportCSV() {
    const exportColumns: ExportColumn[] = [
      { title: 'ID', dataKey: 'id' },
      { title: 'Username', dataKey: 'username' },
      { title: 'Email', dataKey: 'email' },
      { title: 'Role', dataKey: 'role' },
      { title: 'Domaine', dataKey: 'domaine' },
      { title: 'Certifications', dataKey: 'certifications' }
    ];

    const header = exportColumns.map(col => col.title);
    const rows = this.clients.map(client => {
      return exportColumns.map(col => client[col.dataKey as keyof Client]).join(',');
    });
    
    const csvData = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clients_export.csv';
    link.click();
  }

  openNew() {
    this.client = {} as Client;
    this.submitted = false;
    this.clientDialog = true;
  }

  applyGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  deleteSelectedClients() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected clients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clients = this.clients.filter((val) => !this.selectedClients?.includes(val));
        this.selectedClients = null;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Successful', 
          detail: 'Clients Deleted', 
          life: 3000 
        });
      }
    });
  }

  editClient(client: Client) {
    this.client = { ...client };
    this.clientDialog = true;
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${client.username}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clients = this.clients.filter((val) => val.id !== client.id);
        this.client = {} as Client;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Successful', 
          detail: 'Client Deleted', 
          life: 3000 
        });
      }
    });
  }

  hideDialog() {
    this.clientDialog = false;
    this.submitted = false;
  }

  saveClient() {
    this.submitted = true;

    if (this.client.username?.trim() && this.client.email?.trim()) {
      if (this.client.id) {
        // Update existing client
        const index = this.findIndexById(this.client.id);
        if (index !== -1) {
          this.clients[index] = { ...this.client };
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Successful', 
            detail: 'Client Updated', 
            life: 3000 
          });
        }
      } else {
        // Create new client
        this.client.id = this.createId();
        this.client.image = this.client.image || 'client-placeholder.svg';
        this.clients.push({ ...this.client });
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Successful', 
          detail: 'Client Created', 
          life: 3000 
        });
      }

      this.clients = [...this.clients];
      this.clientDialog = false;
      this.client = {} as Client;
    }
  }

  getRoleSeverity(role: string | undefined): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    if (!role) return 'info';
    switch (role.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'gestionnaire':
        return 'warning';
      case 'user':
        return 'success';
      default:
        return 'info';
    }
  }

  findIndexById(id: string): number {
    return this.clients.findIndex(client => client.id === id);
  }

  createId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  getRoleLabel(role: string | undefined): string {
    if (!role) return '';
    const roleObj = this.roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  }
}