import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodCompany } from '../../domains/foodcompany.model';

@Injectable({
  providedIn: 'root'
})
export class FoodCompanyService {
  private apiUrl = 'http://localhost:8080/api/food-companies'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  // Create a new FoodCompany
  createFoodCompany(foodCompany: FoodCompany): Observable<FoodCompany> {
    return this.http.post<FoodCompany>(this.apiUrl, foodCompany);
  }

  // Get all FoodCompanies
  getAllFoodCompanies(): Observable<FoodCompany[]> {
    return this.http.get<FoodCompany[]>(this.apiUrl);
  }

  // Search FoodCompanies by query
  searchFoodCompanies(query: string): Observable<FoodCompany[]> {
    return this.http.get<FoodCompany[]>(`${this.apiUrl}/search?query=${query}`);
  }

  // Update a FoodCompany by ID
  updateFoodCompany(id: number, foodCompany: FoodCompany): Observable<FoodCompany> {
    return this.http.put<FoodCompany>(`${this.apiUrl}/${id}`, foodCompany);
  }

  // Delete a FoodCompany by ID
  deleteFoodCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}