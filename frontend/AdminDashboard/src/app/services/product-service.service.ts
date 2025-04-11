import { Injectable } from '@angular/core';
import { Product } from '../domains/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // Mock function to simulate fetching product data
  getProducts(): Promise<Product[]> {
    // You can replace this with an actual HTTP request to an API.
    return new Promise(resolve => {
      resolve([
        {
          id: '1000',
          code: 'f230fh0g3',
          name: 'Bamboo Watch',
          description: 'Product Description',
          image: 'bamboo-watch.jpg',
          price: 65,
          category: 'Accessories',
          quantity: 24,
          inventoryStatus: 'INSTOCK',
          rating: 5
        },
        {
          id: '1001',
          code: 'f230fh0g3',
          name: 'Bamboo Watch',
          description: 'Product Description',
          image: 'bamboo-watch.jpg',
          price: 65,
          category: 'Accessories',
          quantity: 24,
          inventoryStatus: 'INSTOCK',
          rating: 5
        },
        {
          id: '1002',
          code: 'f230fh0g3',
          name: 'Bamboo Watch',
          description: 'Product Description',
          image: 'bamboo-watch.jpg',
          price: 65,
          category: 'Accessories',
          quantity: 24,
          inventoryStatus: 'INSTOCK',
          rating: 5
        },
        {
          id: '1003',
          code: 'f230fh0g3',
          name: 'Bamboo Watch',
          description: 'Product Description',
          image: 'bamboo-watch.jpg',
          price: 65,
          category: 'Accessories',
          quantity: 24,
          inventoryStatus: 'INSTOCK',
          rating: 5
        },
        {
          id: '1005',
          code: 'd930fh0g5',
          name: 'Leather Wallet',
          description: 'Product Description',
          image: 'leather-wallet.jpg',
          price: 50,
          category: 'Accessories',
          quantity: 10,
          inventoryStatus: 'LOWSTOCK',
          rating: 4
        }
        // Add more products as needed
      ]);
    });
  }
}
