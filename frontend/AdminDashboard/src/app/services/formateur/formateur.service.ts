import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formateur } from '../../domains/formateur.model';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = 'http://localhost:8080/api/formateurs'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  // Create a new Formateur
  createFormateur(formateur: Formateur): Observable<Formateur> {
    return this.http.post<Formateur>(this.apiUrl, formateur);
  }

  // Get all Formateurs
  getAllFormateurs(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(this.apiUrl);
  }

  // Search Formateurs by query
  searchFormateurs(query: string): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(`${this.apiUrl}/search?query=${query}`);
  }

  // Update a Formateur by ID
  updateFormateur(id: number, formateur: Formateur): Observable<Formateur> {
    return this.http.put<Formateur>(`${this.apiUrl}/${id}`, formateur);
  }

  // Delete a Formateur by ID
  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}