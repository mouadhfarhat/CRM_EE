import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../../domains/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications'; // Update if needed

  constructor(private http: HttpClient) {}

  getClientNotifications(clientId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/${clientId}`);
  }
}
