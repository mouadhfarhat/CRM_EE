import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';  
import { CurrencyPipe } from '@angular/common';  
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';  
import { ImportsModule } from '../../imports';
import { Product } from '../../models/product';
import { ProductService } from '../../services/productservice';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { signal } from '@angular/core';


@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [
    DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule
  ],  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css'],
  providers: [ProductService],
})
export class FormationComponent {
  layout: 'list' | 'grid' = 'list';
    products = signal<any>([]);

    options = ['list', 'grid'];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProducts().then((data) => {
            this.products.set([...data.slice(0,12)]);
        });
    }

    getSeverity(item: any): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
      return item.severity || 'secondary';  // Provide a default value
  }
  
}