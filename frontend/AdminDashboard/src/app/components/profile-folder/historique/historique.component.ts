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
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    DataViewModule,
    RatingModule,
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
    providers: [MessageService, ConfirmationService, FormationService],
  
})
export class HistoriqueComponent implements OnInit {@ViewChild('dt') dt!: Table;
  @ViewChild('fileInput') fileInput: any;

  formationDialog: boolean = false;
  formations: Formation[] = []; 
  formation: Formation = {} as Formation;
  selectedFormations!: Formation[] | null;
  submitted: boolean = false;
  statuses: any[] = [];

  constructor(
    private formationService: FormationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.formationService.getFormations().then((data) => (this.formations = data));

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' }
    ];
  }

  dialogVisible: boolean = false;
  selectedFormation: any;
  
  openDialog(product: any) {
    this.selectedFormation = product;
    this.dialogVisible = true;
  }
  
  closeDialog() {
    this.dialogVisible = false;
    this.selectedFormation = null;
  }

  applyGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }




  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.formations.length; i++) {
      if (this.formations[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'pending':
        return 'info';
      case 'canceled':
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getSeverity(product: any): 'success' | 'warning' | 'danger' | 'info' | 'secondary' | undefined {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  getImageUrl(image: string): string {
    return image ? `https://primefaces.org/cdn/primeng/images/demo/product/${image}` : 'path/to/default-image.jpg';
  }
}