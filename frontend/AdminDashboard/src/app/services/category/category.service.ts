import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../../domains/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  // Create a new Category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
  getAllCategories2(): Observable<string[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => categories.map(category => category.name))
    );
  }

  searchCategories2(query: string): Observable<string[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search?query=${query}`).pipe(
      map(categories => categories.map(category => category.name))
    );
  }

  // Get all Categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Search Categories by query
  searchCategories(query: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search?query=${query}`);
  }

  // Update a Category by ID
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  // Delete a Category by ID
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}