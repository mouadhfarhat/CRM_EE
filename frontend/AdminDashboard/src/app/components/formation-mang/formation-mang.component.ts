import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Formation } from '../../domains/formation';
import { FormationService } from '../../services/formation/formation.service';
import { FormateurService } from '../../services/formateur/formateur.service';
import { CategoryService } from '../../services/category/category.service';
import { FoodCompanyService } from '../../services/food-company/food-company.service';
import { Formateur } from '../../domains/formateur.model';
import { Category } from '../../domains/category.model';
import { FoodCompany } from '../../domains/foodcompany.model';
import { TableModule } from 'primeng/table';
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
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// Define an extended interface for Formation with client-side properties
interface ExtendedFormation extends Formation {
  imageUrl?: string | null;
  fileUrl?: string | null;
  fileBlob?: Blob | null;
}

@Component({
  selector: 'app-formation-mang',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    FormsModule,
    InputNumberModule
  ],
  providers: [MessageService, ConfirmationService, FormationService, FormateurService, CategoryService, FoodCompanyService],
  templateUrl: './formation-mang.component.html',
  styleUrls: ['./formation-mang.component.css'],
})
export class FormationMangComponent implements OnInit {
  formations: ExtendedFormation[] = [];
  isLoading: boolean = false;

  // Dialog visibility flags
  displayFormateurDialog: boolean = false;
  displayCategoryDialog: boolean = false;
  displayFoodCompanyDialog: boolean = false;
  displayFormationDialog: boolean = false;
  isEditMode: boolean = false;



  expandedFormationIds: Set<number> = new Set();

 isExpanded(id: number | null): boolean {
    // Handle null case, e.g., return false if id is null
    return id !== null && this.expandedFormationIds.has(id);
  }

  toggleDescription(id: number | null): void {
    if (id !== null) {
      if (this.expandedFormationIds.has(id)) {
        this.expandedFormationIds.delete(id);
      } else {
        this.expandedFormationIds.add(id);
      }
    }
  }


  // Form data models
  newFormateur: any = { firstname: '', lastname: '', email: '', phoneNumber: '' };
  newCategory: any = { name: '' };
  newFoodCompany: any = { name: '', contactInfo: '' };
  newFormation: ExtendedFormation = {
    id: null, // Changed from null to 0 to match type number
    name: '',
    title: '',
    description: '',
    dateDebut: '', // Empty string for <input type="date">
    dateFin: '',   // Empty string for <input type="date">
    registrationEndDate: '', // Empty string for <input type="date">
    price: undefined, // Changed from null to undefined to match type number | undefined
    averageRating: undefined, // Matches type number | undefined
    fileName: null,
    imagePath: null,
    category: undefined, // Changed from null to undefined to match type Category | undefined
    formateur: undefined, // Changed from null to undefined to match type Formateur | undefined
    foodCompany: undefined, // Changed from null to undefined to match type FoodCompany | undefined
    imageUrl: null,
    fileUrl: null,
    fileBlob: null
  };

  // Search results for dropdowns
  formateurs: Formateur[] = [];
  categories: Category[] = [];
  foodCompanies: FoodCompany[] = [];
  Math = Math;

  selectedImage: File | null = null;
  selectedFile: File | null = null;

  // Search input models
  searchFormateurQuery: string = '';
  searchCategoryQuery: string = '';
  searchFoodCompanyQuery: string = '';

  searchTerm: string = '';
  allFormations: ExtendedFormation[] = [];

  constructor(
    private formationService: FormationService,
    private formateurService: FormateurService,
    private categoryService: CategoryService,
    private foodCompanyService: FoodCompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadFormations();
    this.loadInitialData();
  }

loadFormations() {
  this.isLoading = true;
  this.formationService.getFormations().subscribe({
    next: data => {
      this.allFormations = data.map(formation => ({
        ...formation,
        imageUrl: null,
        fileUrl: null,
        fileBlob: null
      })).filter(formation => formation.id !== null); // Ensure no null IDs
      this.formations = [...this.allFormations];
      this.isLoading = false;
      // Load images and files for each formation
      this.formations.forEach(formation => {
        this.loadImageAndFile(formation);
      });
    },
    error: err => {
      console.error('Failed to load formations:', err);
      this.isLoading = false;
    }
  });
}

  loadInitialData() {
    this.formateurService.getAllFormateurs().subscribe(data => this.formateurs = data);
    this.categoryService.getAllCategories().subscribe(data => this.categories = data);
    this.foodCompanyService.getAllFoodCompanies().subscribe(data => this.foodCompanies = data);
  }

  loadImageAndFile(formation: ExtendedFormation) {
    // Load image if imagePath exists
    if (formation.imagePath) {
      this.formationService.getImage(formation.imagePath).subscribe({
        next: (blob: Blob) => {
          formation.imageUrl = URL.createObjectURL(blob);
        },
        error: err => {
          console.error(`Failed to load image for formation ${formation.id}:`, err);
        }
      });
    }

    // Load file if fileName exists
    if (formation.fileName) {
      this.formationService.getFile(formation.fileName).subscribe({
        next: (blob: Blob) => {
          formation.fileUrl = URL.createObjectURL(blob);
          formation.fileBlob = blob; // Store blob for download
        },
        error: err => {
          console.error(`Failed to load file for formation ${formation.id}:`, err);
        }
      });
    }
  }

  // Show dialog methods
  showFormateurDialog() {
    this.newFormateur = { firstname: '', lastname: '', email: '', phoneNumber: '' };
    this.displayFormateurDialog = true;
  }

  showCategoryDialog() {
    this.newCategory = { name: '' };
    this.displayCategoryDialog = true;
  }

  showFoodCompanyDialog() {
    this.newFoodCompany = { name: '', contactInfo: '' };
    this.displayFoodCompanyDialog = true;
  }

showFormationDialog(formation?: ExtendedFormation) {
  if (formation) {
    this.isEditMode = true;
    this.newFormation = {
      id: formation.id, // Keep the existing ID (number or null) for updates
      name: formation.name,
      title: formation.title,
      description: formation.description,
      dateDebut: formation.dateDebut ? new Date(formation.dateDebut).toISOString().split('T')[0] : '',
      dateFin: formation.dateFin ? new Date(formation.dateFin).toISOString().split('T')[0] : '',
      registrationEndDate: formation.registrationEndDate ? new Date(formation.registrationEndDate).toISOString().split('T')[0] : '',
      price: formation.price,
      averageRating: formation.averageRating,
      fileName: formation.fileName,
      imagePath: formation.imagePath,
      category: formation.category,
      formateur: formation.formateur,
      foodCompany: formation.foodCompany,
      imageUrl: formation.imageUrl,
      fileUrl: formation.fileUrl,
      fileBlob: formation.fileBlob
    };
    this.selectedImage = null;
    this.selectedFile = null;
    // Load image and file for the edited formation if not already loaded
    if (this.newFormation.imagePath && !this.newFormation.imageUrl) {
      this.formationService.getImage(this.newFormation.imagePath).subscribe({
        next: (blob: Blob) => {
          this.newFormation.imageUrl = URL.createObjectURL(blob);
        },
        error: err => {
          console.error(`Failed to load image for formation ${this.newFormation.id}:`, err);
        }
      });
    }
    if (this.newFormation.fileName && !this.newFormation.fileUrl) {
      this.formationService.getFile(this.newFormation.fileName).subscribe({
        next: (blob: Blob) => {
          this.newFormation.fileUrl = URL.createObjectURL(blob);
          this.newFormation.fileBlob = blob;
        },
        error: err => {
          console.error(`Failed to load file for formation ${this.newFormation.id}:`, err);
        }
      });
    }
  } else {
    this.isEditMode = false;
    this.newFormation = {
      id: null, // Now valid with id: number | null
      name: '',
      title: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      registrationEndDate: '',
      price: undefined,
      averageRating: undefined,
      fileName: null,
      imagePath: null,
      category: undefined,
      formateur: undefined,
      foodCompany: undefined,
      imageUrl: null,
      fileUrl: null,
      fileBlob: null
    };
    this.selectedImage = null;
    this.selectedFile = null;
  }
  this.displayFormationDialog = true;
}

  // Submit methods
  submitFormateur() {
    this.formateurService.createFormateur(this.newFormateur).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Formateur added successfully' });
        this.displayFormateurDialog = false;
        this.loadInitialData();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Formateur' });
        console.error('Error adding Formateur:', err);
      }
    });
  }

  submitCategory() {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully' });
        this.displayCategoryDialog = false;
        this.loadInitialData();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Category' });
        console.error('Error adding Category:', err);
      }
    });
  }

  submitFoodCompany() {
    this.foodCompanyService.createFoodCompany(this.newFoodCompany).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food Company added successfully' });
        this.displayFoodCompanyDialog = false;
        this.loadInitialData();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Food Company' });
        console.error('Error adding Food Company:', err);
      }
    });
  }
/*
  submitFormation() {
    // Validate required fields before submission
    if (!this.newFormation.formateur || !this.newFormation.foodCompany) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formateur and Food Company are required' });
      return;
    }

    const formData = new FormData();
    formData.append('formation', new Blob([JSON.stringify(this.newFormation)], { type: 'application/json' }));
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditMode) {
      this.formationService.updateFormation(this.newFormation.id, formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Formation updated successfully' });
          this.displayFormationDialog = false;
          this.loadFormations();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Formation' });
          console.error('Error updating Formation:', err);
        }
      });
    } else {
      this.formationService.createFormation(formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Formation added successfully' });
          this.displayFormationDialog = false;
          this.loadFormations();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Formation' });
          console.error('Error adding Formation:', err);
        }
      });
    }
  }*/

deleteFormation(id: number | null) {
  if (id === null) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot delete a formation with no ID' });
    this.isLoading = false;
    return;
  }

  this.isLoading = true;
  const formation = this.formations.find(f => f.id === id);
  const formationTitle = formation ? formation.title : 'this formation';
  this.confirmationService.confirm({
    key: 'confirm',
    message: `Are you sure you want to delete "${formationTitle}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.formationService.deleteFormation(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Formation deleted successfully' });
          this.loadFormations();
        },
        error: (err) => {
          let errorMessage = 'Failed to delete Formation';
          if (err.status === 404) {
            errorMessage = 'Formation not found';
          } else if (err.status === 403) {
            errorMessage = 'You do not have permission to delete this formation';
          }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          console.error(`Error deleting Formation with ID ${id}:`, err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    },
    reject: () => {
      this.isLoading = false;
    }
  });
}

  // Search methods with debounce
  onSearchFormateurs(event: any): void {
    const query = event.filter || '';
    if (query.length > 2) {
      this.formateurService.searchFormateurs(query).subscribe(data => this.formateurs = data);
    } else if (query.length === 0) {
      this.formateurService.getAllFormateurs().subscribe(data => this.formateurs = data);
    }
  }

  onSearchCategories(event: any): void {
    const query = event.filter || '';
    if (query.length > 2) {
      this.categoryService.searchCategories(query).subscribe(data => this.categories = data);
    } else if (query.length === 0) {
      this.categoryService.getAllCategories().subscribe(data => this.categories = data);
    }
  }

  onSearchFoodCompanies(event: any): void {
    const query = event.filter || '';
    if (query.length > 2) {
      this.foodCompanyService.searchFoodCompanies(query).subscribe(data => this.foodCompanies = data);
    } else if (query.length === 0) {
      this.foodCompanyService.getAllFoodCompanies().subscribe(data => this.foodCompanies = data);
    }
  }

  filterFormations() {
    const term = this.searchTerm.toLowerCase();
    this.formations = this.allFormations.filter(f =>
      f.title.toLowerCase().includes(term) || f.name.toLowerCase().includes(term)
    );
  }

  onImageSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }
/*
  // Method to trigger PDF download
  downloadFile(formation: ExtendedFormation) {
    if (formation.fileBlob) {
      const url = window.URL.createObjectURL(formation.fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formation.fileName || 'download.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }*/

  ngOnDestroy() {
    this.formations.forEach(formation => {
      if (formation.imageUrl) URL.revokeObjectURL(formation.imageUrl);
      if (formation.fileUrl) URL.revokeObjectURL(formation.fileUrl);
    });
  }



  // ... (other properties and constructor)





  downloadFile(formation: ExtendedFormation) {
    if (formation.fileBlob) {
      const url = window.URL.createObjectURL(formation.fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formation.fileName || 'download.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.warn('No file blob available for download');
    }
  }

  // ... (other methods like loadImageAndFile, showFormationDialog, submitFormation)

submitFormation() {
  // Validate required fields before submission
  if (!this.newFormation.formateur || !this.newFormation.foodCompany) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formateur and Food Company are required' });
    return;
  }

  // Define the payload type with optional id
  const formationPayload: Partial<ExtendedFormation> & { id?: number | null } = { ...this.newFormation };
  if (!this.isEditMode) {
    delete formationPayload.id; // Remove id for new formations
  }

  const formData = new FormData();
  formData.append('formation', new Blob([JSON.stringify(formationPayload)], { type: 'application/json' }));
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }
  if (this.selectedFile) {
    formData.append('file', this.selectedFile, this.selectedFile.name);
  }

  if (this.isEditMode) {
    this.formationService.updateFormation(this.newFormation.id!, formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Formation updated successfully' });
        this.displayFormationDialog = false;
        this.loadFormations();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Formation' });
        console.error('Error updating Formation:', err);
      }
    });
  } else {
    this.formationService.createFormation(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Formation added successfully' });
        this.displayFormationDialog = false;
        this.loadFormations();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Formation' });
        console.error('Error adding Formation:', err);
      }
    });
  }
}

}