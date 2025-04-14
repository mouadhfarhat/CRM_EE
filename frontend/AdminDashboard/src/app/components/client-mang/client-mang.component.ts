import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import * as Papa from 'papaparse';  
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../domains/product';  
import { ProductService } from '../../services/product-service.service';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';


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
  selector: 'app-client-mang',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, ProductService],
  templateUrl: './client-mang.component.html',
  styleUrl: './client-mang.component.css',
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ]
})
export class ClientMangComponent {

  @ViewChild('dt') dt!: Table;
    @ViewChild('fileInput') fileInput: any;
  
    productDialog: boolean = false;
    products: Product[] = []; 
    product: Product = {} as Product;
    selectedProducts!: Product[] | null;
    submitted: boolean = false;
    statuses: any[] = [];
  
    constructor(
      private productService: ProductService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ) {}
  
    ngOnInit() {
      this.productService.getProducts().then((data) => (this.products = data));
  
      this.statuses = [
        { label: 'In Stock', value: 'INSTOCK' },
        { label: 'Out of Stock', value: 'OUTOFSTOCK' },
        { label: 'Low Stock', value: 'LOWSTOCK' }
      ];
    }
  
     // Trigger the file input when the Import button is clicked
     triggerFileInput() {
      this.fileInput.nativeElement.click();
    }
  
    // Handle file import (CSV)
    importCSV(event: any) {
      const file = event.target.files[0]; // Get the uploaded file
  
      if (file) {
        // Use PapaParse to parse the CSV file
        Papa.parse(file, {
          complete: (result) => {
            const products = result.data; // Extract parsed data from the CSV file
            this.addProducts(products); // Call a function to add products to your list
          },
          header: true, // Set to true if your CSV has headers
          skipEmptyLines: true
        });
      }
    }
  
    // Function to add products to your product list
    addProducts(products: any[]) {
      products.forEach(product => {
        const existingProduct = this.products.find(p => p.id === product.id);  // Check if the product already exists
  
        if (existingProduct) {
          // Update the existing product
          existingProduct.name = product.name;
          existingProduct.price = product.price;
          existingProduct.quantity = product.quantity;
          existingProduct.inventoryStatus = product.inventoryStatus;
          // Update any other fields as necessary
        } else {
          // Add the new product
          this.products.push({
            id: product.id || this.createId(),  // Ensure ID is generated if not present
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            inventoryStatus: product.inventoryStatus,
            // Add any other fields as necessary
          });
        }
      });
    }
  
    // Export products to CSV
    exportCSV() {
      const csvData = this.convertToCSV(this.products); // Convert products to CSV
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'products.csv'; // File name for the downloaded CSV
      link.click(); // Trigger the download
    }
  
    // Convert products array to CSV format
    convertToCSV(products: any[]): string {
      const header = ['id', 'name', 'price', 'quantity', 'inventoryStatus']; // Customize based on your product structure
      const rows = products.map(product => {
        return [product.id, product.name, product.price, product.quantity, product.inventoryStatus].join(',');
      });
      return [header.join(','), ...rows].join('\n');
    }
  
    openNew() {
      this.product = {} as Product;  
      this.submitted = false;
      this.productDialog = true;
    }
  
    applyGlobalFilter(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      this.dt.filterGlobal(value, 'contains');
    }
  
    deleteSelectedProducts() {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
          this.selectedProducts = null;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        }
      });
    }
  
    editProduct(product: Product) {
      this.product = { ...product };
      this.productDialog = true;
    }
  
    deleteProduct(product: Product) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete ${product.name}?`,
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.products = this.products.filter((val) => val.id !== product.id);
          this.product = {} as Product;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }
      });
    }
  
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    }
  
    saveProduct() {
      this.submitted = true;
  
      if (this.product.name?.trim()) {
        if (this.product.id) {
          // Update the existing product if it exists
          const existingProduct = this.products.find(p => p.id === this.product.id);
          if (existingProduct) {
            Object.assign(existingProduct, this.product);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          }
        } else {
          // Create a new product
          this.product.id = this.createId();
          this.product.image = 'product-placeholder.svg';
          this.products.push(this.product);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
  
        this.products = [...this.products];
        this.productDialog = false;
        this.product = {} as Product;
      }
    }
  
    findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    }
  
    createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    }
  
    getSeverity(status: string | undefined): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
      if (!status) return undefined;
      switch (status.toUpperCase()) {
        case 'INSTOCK':
          return 'success';
        case 'OUTOFSTOCK':
          return 'danger';
        case 'LOWSTOCK':
          return 'warning';
        default:
          return 'secondary';
      }
    }
  }
  


