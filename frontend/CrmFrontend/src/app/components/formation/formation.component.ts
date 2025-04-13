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
    DataViewModule,
    ButtonModule,
    TagModule,
    CommonModule,
  ],  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css'],
  providers: [ProductService],
})
export class FormationComponent {
  layout: 'list' | 'grid' = 'list';
  products = [
    {
      name: 'Product 1',
      category: 'Laptops',
      image: 'bamboo-watch.jpg',
      price: 199,
      rating: 4.5,
      inventoryStatus: 'INSTOCK',
    },
    {
      name: 'Product 2',
      category: 'Phones',
      image: 'blue-t-shirt.jpg',
      price: 299,
      rating: 3.7,
      inventoryStatus: 'OUTOFSTOCK',
    },
    {
      name: 'Product 3',
      category: 'Headphones',
      image: 'headphones.jpg',
      price: 99,
      rating: 4.0,
      inventoryStatus: 'LOWSTOCK',
    },
    {
      name: 'Product 4',
      category: 'Smart Watches',
      image: 'smart-watch.jpg',
      price: 159,
      rating: 4.2,
      inventoryStatus: 'INSTOCK',
    },
    {
      name: 'Product 1',
      category: 'Laptops',
      image: 'bamboo-watch.jpg',
      price: 199,
      rating: 4.5,
      inventoryStatus: 'INSTOCK',
    },
    {
      name: 'Product 2',
      category: 'Phones',
      image: 'blue-t-shirt.jpg',
      price: 299,
      rating: 3.7,
      inventoryStatus: 'OUTOFSTOCK',
    },
    {
      name: 'Product 3',
      category: 'Headphones',
      image: 'headphones.jpg',
      price: 99,
      rating: 4.0,
      inventoryStatus: 'LOWSTOCK',
    },
    {
      name: 'Product 4',
      category: 'Smart Watches',
      image: 'smart-watch.jpg',
      price: 159,
      rating: 4.2,
      inventoryStatus: 'INSTOCK',
    }
  ];
  setListLayout() {
    this.layout = 'list';
  }
  setGridLayout() {
    this.layout = 'grid';
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
    // Provide a fallback image if no image is found for the product
    return image ? `https://primefaces.org/cdn/primeng/images/demo/product/${image}` : 'path/to/default-image.jpg';
  }
}