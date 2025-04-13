// productservice.ts
import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {
  getProducts() {
    return Promise.resolve([
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        inventoryStatus: 'INSTOCK',
        rating: 5,
      },
      {
        id: '1001',
        code: 'f230fh0g4',
        name: 'Leather Bag',
        description: 'Product Description',
        image: 'leather-bag.jpg',
        price: 120,
        category: 'Accessories',
        inventoryStatus: 'LOWSTOCK',
        rating: 4,
      },
      // Add more products as needed
    ]);
  }
}
