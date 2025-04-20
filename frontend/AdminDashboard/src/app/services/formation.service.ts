import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formation } from '../models/formation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8080/formations'; // adjust if needed

  constructor(private http: HttpClient) {}

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  searchFormations(title: string): Observable<Formation[]> {
    console.log('Searching formations with term:', title); // Debugging log
    return this.http.get<Formation[]>(`${this.apiUrl}/search`, {
      params: { title }
    });
  }
  
  
}