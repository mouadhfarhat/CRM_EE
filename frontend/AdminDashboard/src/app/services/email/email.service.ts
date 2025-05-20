import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailPayload {
  recipients: string[];
  subject: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/email/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(payload: EmailPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
