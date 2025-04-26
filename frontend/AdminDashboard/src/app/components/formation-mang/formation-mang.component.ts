import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-formation-mang',
  standalone: true,
  imports: [HttpClientModule,TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, FormationService],
  templateUrl: './formation-mang.component.html',
  styleUrls: ['./formation-mang.component.css'],
 
})
export class FormationMangComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  formationDialog: boolean = false;
  formations: Formation[] = [];
  formation: Formation = this.initializeFormation();
  selectedFormations: Formation[] = [];
  submitted: boolean = false;

  constructor(
    private formationService: FormationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load formations', life: 3000 });
        console.error('Error loading formations:', err);
      }
    });
  }

  openNew() {
    this.formation = this.initializeFormation();
    this.submitted = false;
    this.formationDialog = true;
  }

  deleteSelectedFormations() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected formations?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Here you would call your service to delete multiple formations
        // For now, we'll just filter them out locally
        this.formations = this.formations.filter(val => !this.selectedFormations.includes(val));
        this.selectedFormations = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formations Deleted', life: 3000 });
      }
    });
  }

  editFormation(formation: Formation) {
    // Create a copy to avoid direct modification
    this.formation = { ...formation };
    this.formationDialog = true;
  }

  deleteFormation(formation: Formation) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + formation.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Here you would call your service to delete the formation
        // For now, we'll just filter it out locally
        this.formations = this.formations.filter(val => val.id !== formation.id);
        this.formation = this.initializeFormation();
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
        // Update existing formation
        const index = this.findIndexById(this.formation.id);
        if (index !== -1) {
          this.formations[index] = this.formation;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formation Updated', life: 3000 });
        }
      } else {
        // Create new formation
        this.formation.id = this.createId();
        this.formation.image = 'formation-placeholder.jpg'; // Default image
        this.formations.push(this.formation);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Formation Created', life: 3000 });
      }

      this.formations = [...this.formations];
      this.formationDialog = false;
      this.formation = this.initializeFormation();
    }
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt?.filterGlobal(filterValue, 'contains');
  }

  triggerFileInput() {
    this.fileInput?.nativeElement.click();
  }

  importCSV(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Here you would implement CSV parsing and importing
      this.messageService.add({ severity: 'info', summary: 'CSV Import', detail: 'Import functionality to be implemented', life: 3000 });
      event.target.value = '';
    }
  }

  exportCSV() {
    // Here you would implement CSV export
    this.messageService.add({ severity: 'info', summary: 'CSV Export', detail: 'Export functionality to be implemented', life: 3000 });
  }

  findIndexById(id: number): number {
    return this.formations.findIndex(formation => formation.id === id);
  }

  createId(): number {
    // Simple method to generate IDs for demo purposes
    // In a real app, the backend would handle this
    return Math.floor(Math.random() * 1000) + 1;
  }

  private initializeFormation(): Formation {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      category: '',
      quantity: 0,
      image: '',
      rating: 0,
      title: '',
      dateDebut: new Date(),
      dateFin: new Date()
    };
  }
}