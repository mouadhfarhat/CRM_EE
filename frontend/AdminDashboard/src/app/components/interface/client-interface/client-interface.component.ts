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
    CarouselComponent
  ],
  providers: [FormationService],
  templateUrl: './client-interface.component.html',
  styleUrl: './client-interface.component.css'
})
export class ClientInterfaceComponent {
  displayDialog = false;
  selectedFormation: Formation | null = null;
  formations: Formation[] = [];
  first = 0;
  rows = 6;

  constructor(private formationService: FormationService) {}

  layout: 'list' | 'grid' = 'list';

  
  
  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.getFormations().then(data => {
      this.formations = data;
    });
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
    this.selectedFormation = formation;
    this.displayDialog = true;
  }

  makeDemande(formation: Formation) {
    console.log('Making demande for:', formation);
    this.displayDialog = false;
  }
}
