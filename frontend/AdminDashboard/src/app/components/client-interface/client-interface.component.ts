import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { FormationService } from '../../services/formation/formation.service';
import { Formation } from '../../domains/formation';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-client-interface',
  standalone: true,
  imports: [
    DataViewModule,
    ButtonModule,
    TagModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [FormationService],
  templateUrl: './client-interface.component.html',
  styleUrl: './client-interface.component.css'
})
export class ClientInterfaceComponent {
  
  layout: 'list' | 'grid' = 'list';
  
  // Array to store formation data
  formations: Formation[] = []; 

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations(); // Call method to load formations when component is initialized
  }

  // Method to fetch formations data
  loadFormations() {
    this.formationService.getFormations().then(data => {
      this.formations = data; // Assign data to formations array
    });
  }

  // Method to handle layout change
  onLayoutChange(event: any) {
    this.layout = event.value; // Set layout based on the event's value
  }

  // Method to determine the severity of the formation based on its inventory status
  getSeverity(formation: Formation): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    if (formation.inventoryStatus === 'INSTOCK') {
      return 'success';
    } else if (formation.inventoryStatus === 'OUTOFSTOCK') {
      return 'danger';
    } else {
      return 'warning';
    }
  }
  
}
