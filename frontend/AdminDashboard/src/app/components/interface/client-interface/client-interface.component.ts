import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { FormationService } from '../../../services/formation/formation.service';
import { Formation } from '../../../domains/formation';
import { CarouselComponent } from '../carousel/carousel.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';

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
    PaginatorModule,
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
  currentPage: number = 1;
  totalRecords: number = 0;
  rowsPerPage: number = 5;
  activeCategoryId: number | null = null;
  searchTerm: string = '';
  sortOption: string = 'default';
  imageUrls: { [id: number]: string } = {};
  interestedFormations: Set<number> = new Set();

  constructor(
    private formationService: FormationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadInterestedFormations();
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data: Formation[]) => {
        this.totalRecords = data.length;
        this.formations = data.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);

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

  onCategorySelected(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.currentPage = 1;
    this.loadFormations();
  }

  onSearchTermChanged(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadFormations();
  }

  onSortOptionChanged(sortOption: string): void {
    this.sortOption = sortOption;
    this.currentPage = 1;
    this.loadFormations();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadFormations();
  }
}
