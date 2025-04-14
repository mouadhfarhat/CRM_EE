import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import * as Papa from 'papaparse';  
import { ConfirmationService, MessageService } from 'primeng/api';
import { Formation } from '../../domains/formation';  
import { FormationService } from '../../services/formation/formation.service';
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
  selector: 'app-formation-mang',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, FormationService],
  templateUrl: './formation-mang.component.html',
  styleUrls: ['./formation-mang.component.css'],
  styles: [
    `:host ::ng-deep .p-dialog .formation-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ]
})
export class FormationMangComponent {
  @ViewChild('dt') dt!: Table;
  @ViewChild('fileInput') fileInput: any;

  formationDialog: boolean = false;
  formations: Formation[] = []; 
  formation: Formation = {} as Formation;
  selectedFormations!: Formation[] | null;
  submitted: boolean = false;
  statuses: any[] = [];

  constructor(
    private formationService: FormationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.formationService.getFormations().then((data) => (this.formations = data));

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
          const formations = result.data; // Extract parsed data from the CSV file
          this.addFormations(formations); // Call a function to add formations to your list
        },
        header: true, // Set to true if your CSV has headers
        skipEmptyLines: true
      });
    }
  }
  
  // Function to add formations to your formation list
  addFormations(formations: any[]) {
    formations.forEach(formation => {
      const existingFormation = this.formations.find(p => p.id === formation.id);  // Check if the formation already exists
  
      if (existingFormation) {
        // Update the existing formation
        existingFormation.name = formation.name;
        existingFormation.price = formation.price;
        existingFormation.quantity = formation.quantity;
        existingFormation.inventoryStatus = formation.inventoryStatus;
        // Update any other fields as necessary
      } else {
        // Add the new formation
        this.formations.push({
          id: formation.id || this.createId(),  // Ensure ID is generated if not present
          name: formation.name,
          price: formation.price,
          quantity: formation.quantity,
          inventoryStatus: formation.inventoryStatus,
          // Add any other fields as necessary
        });
      }
    });
  
    // Add these lines after processing all formations
    this.formations = [...this.formations];
    this.messageService.add({
      severity: 'success', 
      summary: 'Import Successful', 
      detail: `${formations.length} formations processed`, 
      life: 3000
    });
  }

  // Export formations to CSV
  exportCSV() {
    const csvData = this.convertToCSV(this.formations); // Convert formations to CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formations.csv'; // File name for the downloaded CSV
    link.click(); // Trigger the download
  }

  // Convert formations array to CSV format
  convertToCSV(formations: any[]): string {
    const header = ['id', 'name', 'price', 'quantity', 'inventoryStatus']; // Customize based on your formation structure
    const rows = formations.map(formation => {
      return [formation.id, formation.name, formation.price, formation.quantity, formation.inventoryStatus].join(',');
    });
    return [header.join(','), ...rows].join('\n');
  }

  openNew() {
    this.formation = {} as Formation;  
    this.submitted = false;
    this.formationDialog = true;
  }

  applyGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  deleteSelectedFormations() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected formations?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formations = this.formations.filter((val) => !this.selectedFormations?.includes(val));
        this.selectedFormations = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formations Deleted', life: 3000 });
      }
    });
  }

  editFormation(formation: Formation) {
    this.formation = { ...formation };
    this.formationDialog = true;
  }

  deleteFormation(formation: Formation) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${formation.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formations = this.formations.filter((val) => val.id !== formation.id);
        this.formation = {} as Formation;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formation Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.formationDialog = false;
    this.submitted = false;
  }

  saveFormation() {
    this.submitted = true;

    if (this.formation.name?.trim()) {
      if (this.formation.id) {
        // Update the existing formation if it exists
        const existingFormation = this.formations.find(p => p.id === this.formation.id);
        if (existingFormation) {
          Object.assign(existingFormation, this.formation);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formation Updated', life: 3000 });
        }
      } else {
        // Create a new formation
        this.formation.id = this.createId();
        this.formation.image = 'formation-placeholder.svg';
        this.formations.push(this.formation);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formation Created', life: 3000 });
      }

      this.formations = [...this.formations];
      this.formationDialog = false;
      this.formation = {} as Formation;
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.formations.length; i++) {
      if (this.formations[i].id === id) {
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
