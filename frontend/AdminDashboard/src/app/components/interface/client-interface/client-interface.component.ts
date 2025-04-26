import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
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
    CarouselComponent
  ],
  providers: [FormationService],
  templateUrl: './client-interface.component.html',
  styleUrls: ['./client-interface.component.css']
})
export class ClientInterfaceComponent implements OnInit {
  formations: Formation[] = [];
  layout: 'list' | 'grid' = 'grid';
  
  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe({
      next: (data: Formation[]) => {
        this.formations = data;
      },
      error: (error) => {
        console.error('Error fetching formations:', error);
      }
    });
  }

  getAvailableSeats(formation: Formation): string {
    if (formation.quantity === undefined) {
      return 'Unknown';
    }
    
    // You can add more sophisticated logic here based on demandes or interestedClients
    const takenSeats = formation.demandes?.length || 0;
    const availableSeats = formation.quantity - takenSeats;
    
    if (availableSeats <= 0) {
      return 'Full';
    } else if (availableSeats < 5) {
      return `${availableSeats} left`;
    } else {
      return 'Available';
    }
  }

  searchFormations(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.formationService.searchFormations(searchTerm).subscribe({
        next: (data: Formation[]) => {
          this.formations = data;
        },
        error: (error) => {
          console.error('Error searching formations:', error);
        }
      });
    } else {
      this.loadFormations(); // Load all formations if search term is empty
    }
  }
}