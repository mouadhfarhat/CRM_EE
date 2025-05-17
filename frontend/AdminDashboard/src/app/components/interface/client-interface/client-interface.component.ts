import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { FormationService } from '../../../services/formation/formation.service';
import { Formation } from '../../../domains/formation';
import { CarouselComponent } from '../carousel/carousel.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { Client } from '../../../domains/client';
import { ClientService } from '../../../services/client/client.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-client-interface',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    DialogModule,
    RouterModule,
    RatingModule,
    CarouselComponent,
    TooltipModule,
    ToastModule
  ],
  providers: [FormationService, MessageService],
  templateUrl: './client-interface.component.html',
  styleUrls: ['./client-interface.component.css']
})
export class ClientInterfaceComponent implements OnInit {
  formations: Formation[] = [];
  layout: 'list' | 'grid' = 'grid';
  activeCategoryId: number | null = null;
  searchTerm: string = '';
  sortOption: string = 'default';
  imageUrls: { [id: number]: string } = {};
  interestedFormations: Set<number> = new Set();
  client: Client | null = null;
  clientId: number | null = null;


  constructor(
    private formationService: FormationService,
    private messageService: MessageService,
    private clientService: ClientService,
    private authService: AuthService,
    
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadInterestedFormations();
    this.loadClientId();

  }

  loadClientId(): void {
    this.authService.getClientId().subscribe({
      next: (id: number) => {
        this.clientId = id;
      },
      error: (err) => {
        console.error('Error fetching client ID:', err);
      }
    });
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data: Formation[]) => {
        let filteredFormations = data;

        // Apply category filter
        if (this.activeCategoryId !== null) {
          filteredFormations = filteredFormations.filter(
            formation => formation.category?.id === this.activeCategoryId
          );
        }

        // Apply search filter
        if (this.searchTerm) {
          const lowerSearchTerm = this.searchTerm.toLowerCase();
          filteredFormations = filteredFormations.filter(
            formation =>
              formation.title.toLowerCase().includes(lowerSearchTerm) ||
              formation.description.toLowerCase().includes(lowerSearchTerm)
          );
        }

        

        // Set all formations
        this.formations = filteredFormations;

        // Load images
        this.formations.forEach(formation => {
          if (formation.imagePath) {
            this.formationService.getImage(formation.imagePath).subscribe(blob => {
              const reader = new FileReader();
              reader.onload = () => {
                this.imageUrls[formation.id!] = reader.result as string;
              };
              reader.readAsDataURL(blob);
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching formations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load formations'
        });
      }
    });
  }

  loadInterestedFormations(): void {
    this.formationService.getInterestedFormations().subscribe({
      next: (ids: number[]) => {
        this.interestedFormations = new Set(ids);
      },
      error: (err) => {
        console.error('Failed to load interested formations', err);
      }
    });
  }

  isInterested(formationId: number): boolean {
    return this.interestedFormations.has(formationId);
  }

  toggleInterest(formationId: number): void {
    if (this.isInterested(formationId)) {
      this.formationService.unmarkInterest(formationId).subscribe({
        next: (response) => {
          this.interestedFormations.delete(formationId);
          this.messageService.add({
            severity: 'info',
            summary: 'Removed',
            detail: response.message || 'Interest removed'
          });
        },
        error: (error) => {
          console.error('Error unmarking interest:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove interest'
          });
        }
      });
    } else {
      this.formationService.markInterest(formationId).subscribe({
        next: (response) => {
          this.interestedFormations.add(formationId);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Interest marked successfully'
          });
        },
        error: (error) => {
          console.error('Error marking interest:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to mark interest'
          });
        }
      });
    }
  }

  onCategorySelected(categoryId: number | null): void {
    this.activeCategoryId = categoryId;
    this.loadFormations();
  }

  onSearchTermChanged(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.loadFormations();
  }

  onSortOptionChanged(sortOption: string): void {
    this.sortOption = sortOption;
    this.loadFormations();
  }

  downloadFile(fileName: string): void {
  this.formationService.getFile(fileName).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('File download failed:', err);
    }
  });
}


isRegistrationClosed(registrationEndDate: string): boolean {
  const today = new Date();
  const endDate = new Date(registrationEndDate);
  return endDate < today;
}


}