import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';  
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';  
import { FormationService } from '../../../services/formation/formation.service';
import { RatingModule } from 'primeng/rating';
import { Formation } from '../../../domains/formation';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    DialogModule,
    DataViewModule,
    RatingModule,
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    TagModule,
    RouterLink
  ],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
  providers: [MessageService, ConfirmationService, FormationService],
})
export class HistoriqueComponent implements OnInit {
  formations: Formation[] = [];
  displayDialog: boolean = false;
  selectedFormation: Formation | null = null;
  
  constructor(
    private formationService: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe(
      (data) => {
        this.formations = data;
      },
      (error) => {
        console.error('Error loading formations:', error);
        // Fallback to static data if API fails
      }
    );
  }

  getImageUrl(imageName: string | undefined): string {
    if (!imageName) return 'assets/images/placeholder.jpg';
    return `assets/images/formations/${imageName}`;
  }

  getStatusSeverity(status: string | undefined): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (!status) return 'info';
    
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }


  openDialog(formation: Formation): void {
    this.selectedFormation = formation;
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.selectedFormation = null;
  }

  navigateToComposeMail(formation: Formation): void {
    // You could also use queryParams to pass formation info
    this.router.navigate(['/composeMail'], { 
      state: { 
        formationInfo: formation 
      }
    });
  }

  // For handling rating changes
  onRatingChange(formation: Formation, value: number): void {
    formation.rating = value;
    // Here you would typically save the review to backend
    console.log(`Submitting rating ${value} for formation ${formation.name}`);
    // You could implement a service method to submit the review
  }

 
  }
