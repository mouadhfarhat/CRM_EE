import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../domains/category.model';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, FormsModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  categories: Category[] = [];
  activeCategoryId: number | null = null;
  @Output() categorySelected = new EventEmitter<number | null>();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() sortOptionChanged = new EventEmitter<string>();

  sortOption: string = 'default';
  searchTerm: string = '';
  showSearch: boolean = false;
  categorySearchTerm: string = '';

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        // Optionally, set "All" as default
        this.activeCategoryId = null;
        this.categorySelected.emit(null);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  searchCategories(): void {
    if (this.categorySearchTerm) {
      this.categoryService.searchCategories(this.categorySearchTerm).subscribe({
        next: (categories: Category[]) => {
          this.categories = categories;
          this.activeCategoryId = null;
          this.categorySelected.emit(null);
        },
        error: (error) => {
          console.error('Error searching categories:', error);
        }
      });
    } else {
      this.loadCategories();
    }
  }

  selectCategory(category: Category | { id: null; name: string }): void {
    const categoryId = category.id;
    if (this.activeCategoryId === categoryId) {
      this.activeCategoryId = null;
      this.categorySelected.emit(null);
    } else {
      this.activeCategoryId = categoryId;
      this.categorySelected.emit(categoryId);
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
      this.searchTermChanged.emit('');
    }
  }

  onSearchChange(): void {
    this.searchTermChanged.emit(this.searchTerm);
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOptionChanged.emit(selectElement.value);
  }
}