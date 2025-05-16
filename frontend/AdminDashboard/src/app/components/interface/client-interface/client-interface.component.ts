import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { FormationService } from '../../../services/formation/formation.service';
import { Formation } from '../../../domains/formation';
import { CarouselComponent } from '../carousel/carousel.component';
import { HttpClientModule } from '@angular/common/http';

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
    CarouselComponent
  ],
  providers: [FormationService],
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

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

loadFormations(): void {
  this.formationService.getAllFormations().subscribe({
    next: (data: Formation[]) => {
      this.totalRecords = data.length;
      this.formations = data.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);

      // Load images for each formation
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
    }
  });
}


  onCategorySelected(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.currentPage = 1;
    // Filter formations by category if needed
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