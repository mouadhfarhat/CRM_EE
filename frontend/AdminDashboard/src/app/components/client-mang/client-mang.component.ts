import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as Papa from 'papaparse';  
import { forkJoin } from 'rxjs';
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
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-client-mang',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule,HttpClientModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
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
export class ClientMangComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  clients: Client[] = [];
  client: Client = {} as Client;
  selectedClients: Client[] = [];
  clientDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  saving: boolean = false;

  roles: any[] = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Client', value: 'CLIENT' },
    { label: 'Instructor', value: 'INSTRUCTOR' }
  ];

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Could not load clients', 
          life: 3000 
        });
        this.loading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  openNew(): void {
    this.client = {
      id: 0,
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      phoneNumber: '',
      role: 'CLIENT'
    } as Client;
    this.submitted = false;
    this.clientDialog = true;
  }

  editClient(client: Client): void {
    this.client = { ...client };
    this.clientDialog = true;
  }

  deleteClient(client: Client): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + client.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.delete(client.id).subscribe({
          next: () => {
            this.clients = this.clients.filter(val => val.id !== client.id);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Successful', 
              detail: 'Client Deleted', 
              life: 3000 
            });
          },
          error: (error) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Could not delete client', 
              life: 3000 
            });
            console.error('Error deleting client:', error);
          }
        });
      }
    });
  }

  deleteSelectedClients(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected clients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteObservables = this.selectedClients.map(client => 
          this.clientService.delete(client.id)
        );
        
        // Using Promise.all for simplicity, though there are better approaches for multiple HTTP requests
        Promise.all(deleteObservables.map(obs => obs.toPromise()))
          .then(() => {
            this.clients = this.clients.filter(val => !this.selectedClients.includes(val));
            this.selectedClients = [];
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Successful', 
              detail: 'Clients Deleted', 
              life: 3000 
            });
          })
          .catch(error => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Could not delete selected clients', 
              life: 3000 
            });
            console.error('Error deleting selected clients:', error);
          });
      }
    });
  }

  hideDialog(): void {
    this.clientDialog = false;
    this.submitted = false;
  }

  saveClient(): void {
    this.submitted = true;

    if (!this.client.username || !this.client.email) {
      return;
    }

    this.saving = true;

    if (this.client.id) {
      // Update existing client
      this.clientService.update(this.client.id, this.client).subscribe({
        next: (result) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Successful', 
            detail: 'Client Updated', 
            life: 3000 
          });
          this.updateClientInList(result);
          this.saving = false;
          this.clientDialog = false;
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Could not update client', 
            life: 3000 
          });
          this.saving = false;
          console.error('Error updating client:', error);
        }
      });
    } else {
      // Create new client
      this.clientService.create(this.client).subscribe({
        next: (result) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Successful', 
            detail: 'Client Created', 
            life: 3000 
          });
          this.clients.push(result);
          this.saving = false;
          this.clientDialog = false;
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Could not create client', 
            life: 3000 
          });
          this.saving = false;
          console.error('Error creating client:', error);
        }
      });
    }
  }

  updateClientInList(updatedClient: Client): void {
    const index = this.clients.findIndex(c => c.id === updatedClient.id);
    if (index !== -1) {
      this.clients[index] = updatedClient;
      // Create a new array reference to trigger change detection
      this.clients = [...this.clients];
    }
  }

  applyGlobalFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt?.filterGlobal(filterValue, 'contains');
  }

  getRoleSeverity(role: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'INSTRUCTOR':
        return 'warning';
      case 'CLIENT':
        return 'success';
      default:
        return 'info'; // or maybe 'secondary' if you prefer
    }
  }
  
}