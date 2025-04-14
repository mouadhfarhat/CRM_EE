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
    statuses: any[] = [];
  
    constructor(
      private clientService: ClientService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ) {}
  
    ngOnInit() {
      this.clientService.getClients().then((data) => (this.clients = data));
  
      this.statuses = [
        { label: 'In Stock', value: 'INSTOCK' },
        { label: 'Out of Stock', value: 'OUTOFSTOCK' },
        { label: 'Low Stock', value: 'LOWSTOCK' }
      ];
    }
  
     // Trigger the file input when the Import button is clicked
     triggerFileInput() {
      this.fileInput.nativeElement.click();
    }
  
    // Handle file import (CSV)
    importCSV(event: any) {
      const file = event.target.files[0]; // Get the uploaded file
  
      if (file) {
        // Use PapaParse to parse the CSV file
        Papa.parse(file, {
          complete: (result) => {
            const clients = result.data; // Extract parsed data from the CSV file
            this.addClients(clients); // Call a function to add clients to your list
          },
          header: true, // Set to true if your CSV has headers
          skipEmptyLines: true
        });
      }
    }
  
    // Function to add clients to your client list
    addClients(clients: any[]) {
      clients.forEach(client => {
        const existingClient = this.clients.find(p => p.id === client.id);  // Check if the client already exists
  
        if (existingClient) {
          // Update the existing client
          existingClient.name = client.name;
          existingClient.price = client.price;
          existingClient.quantity = client.quantity;
          existingClient.inventoryStatus = client.inventoryStatus;
          // Update any other fields as necessary
        } else {
          // Add the new client
          this.clients.push({
            id: client.id || this.createId(),  // Ensure ID is generated if not present
            name: client.name,
            price: client.price,
            quantity: client.quantity,
            inventoryStatus: client.inventoryStatus,
            // Add any other fields as necessary
          });
        }
      });
    }
  
    // Export clients to CSV
    exportCSV() {
      const csvData = this.convertToCSV(this.clients); // Convert clients to CSV
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'clients.csv'; // File name for the downloaded CSV
      link.click(); // Trigger the download
    }
  
    // Convert clients array to CSV format
    convertToCSV(clients: any[]): string {
      const header = ['id', 'name', 'price', 'quantity', 'inventoryStatus']; // Customize based on your client structure
      const rows = clients.map(client => {
        return [client.id, client.name, client.price, client.quantity, client.inventoryStatus].join(',');
      });
      return [header.join(','), ...rows].join('\n');
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
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
        }
      });
    }
  
    editClient(client: Client) {
      this.client = { ...client };
      this.clientDialog = true;
    }
  
    deleteClient(client: Client) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete ${client.name}?`,
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.clients = this.clients.filter((val) => val.id !== client.id);
          this.client = {} as Client;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
        }
      });
    }
  
    hideDialog() {
      this.clientDialog = false;
      this.submitted = false;
    }
  
    saveClient() {
      this.submitted = true;
  
      if (this.client.name?.trim()) {
        if (this.client.id) {
          // Update the existing client if it exists
          const existingClient = this.clients.find(p => p.id === this.client.id);
          if (existingClient) {
            Object.assign(existingClient, this.client);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
          }
        } else {
          // Create a new client
          this.client.id = this.createId();
          this.client.image = 'client-placeholder.svg';
          this.clients.push(this.client);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
        }
  
        this.clients = [...this.clients];
        this.clientDialog = false;
        this.client = {} as Client;
      }
    }
  
    findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    }
  
    createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    }
  
    getSeverity(status: string | undefined): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
      if (!status) return undefined;
      switch (status.toUpperCase()) {
        case 'INSTOCK':
          return 'success';
        case 'OUTOFSTOCK':
          return 'danger';
        case 'LOWSTOCK':
          return 'warning';
        default:
          return 'secondary';
      }
    }
  }
  


