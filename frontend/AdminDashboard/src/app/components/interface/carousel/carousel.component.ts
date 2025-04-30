import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Category } from '../../../domains/category';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, HttpClientModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  categories: Category[] = [];
  newCategory: Category = { name: '' };
  selectedCategory: Category | null = null;

  responsiveOptions: any;

  constructor(private categoryService: CategoryService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  addCategory(): void {
    if (!this.newCategory.name.trim()) return;

    this.categoryService.create(this.newCategory).subscribe(() => {
      this.newCategory.name = '';
      this.loadCategories();
    });
  }

  editCategory(category: Category): void {
    this.selectedCategory = { ...category };
  }

  updateCategory(): void {
    if (!this.selectedCategory || !this.selectedCategory.id) return;

    this.categoryService.update(this.selectedCategory.id, this.selectedCategory).subscribe(() => {
      this.selectedCategory = null;
      this.loadCategories();
    });
  }

  deleteCategory(id: number): void {
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }

  cancelEdit(): void {
    this.selectedCategory = null;
  }
}
