import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendrierEvent } from '../models/CalendrierEvent .model';

@Injectable({
  providedIn: 'root'
})
export class CalendrierEventService {
  private baseUrl = '/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<CalendrierEvent[]> {
    return this.http.get<CalendrierEvent[]>(`${this.baseUrl}/all`);
  }

  getEventById(id: number): Observable<CalendrierEvent> {
    return this.http.get<CalendrierEvent>(`${this.baseUrl}/${id}`);
  }

  addEvent(event: CalendrierEvent): Observable<CalendrierEvent> {
    return this.http.post<CalendrierEvent>(`${this.baseUrl}/add`, event);
  }

  updateEvent(id: number, event: CalendrierEvent): Observable<CalendrierEvent> {
    return this.http.put<CalendrierEvent>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  
}
