import { Component } from '@angular/core';
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

@Component({
  selector: 'app-client-interface',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    DialogModule,
    RouterModule,
    PaginatorModule,
    CarouselComponent,
  ],
  providers: [FormationService],
  templateUrl: './client-interface.component.html',
  styleUrls: ['./client-interface.component.css'] // Corrected the styleUrl to styleUrls
})
export class ClientInterfaceComponent {
  displayDialog = false;
  selectedFormation: Formation | null = null;  // Renamed this to match the template
  formations: Formation[] = [];
  first = 0;
  rows = 6;
  detailsVisible = false; // Add this property to toggle visibility of the dialog

  constructor(private formationService: FormationService) {}

  layout: 'list' | 'grid' = 'grid';

  onLayoutChange(layout: any) {
    if (layout === 'list' || layout === 'grid') {
      this.layout = layout;
    }
  }

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations() {
    // Calling the service method to get the data
    this.formations = this.formationService.getFormationsData();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadFormations();
  }

  getSeverity(formation: Formation): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    switch (formation.inventoryStatus) {
      case 'INSTOCK': return 'success';
      case 'OUTOFSTOCK': return 'danger';
      default: return 'warning';
    }
  }

  showDetails(formation: Formation) {
    this.selectedFormation = formation; // Assign the formation to selectedFormation
    this.detailsVisible = true; // This will trigger the modal to open
  }

  makeDemande(formation: Formation) {
    console.log('Making demande for:', formation);
    this.detailsVisible = false;  // Close the details dialog after the action
  }
}
