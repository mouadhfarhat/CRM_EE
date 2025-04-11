import { Component, inject, signal } from '@angular/core';
import { Product } from '../../domains/product';
import { ProductService } from '../../services/product-service.service';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'formation-mang',
  templateUrl: './formation-mang.component.html',
  standalone: true,
  imports: [DataView, ButtonModule, Tag, CommonModule],
  providers: [ProductService]
})
export class FormationMangComponent {
   // Use WritableSignal to manage products
   products = signal<Product[]>([]); // Declare it as an array of Product

   productService = inject(ProductService);
 
   ngOnInit() {
     this.productService.getProducts().then((data) => {
       const d = data.slice(0, 5); // Get only 5 products for testing
       this.products.set([...d]); // Set the value to the signal
     });
   }
 
   // Extract the value of the signal to be passed to the DataView component
   get productsArray() {
     return this.products(); // Access the current value of the WritableSignal
   }
  getSeverity(product: any): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
  
}
