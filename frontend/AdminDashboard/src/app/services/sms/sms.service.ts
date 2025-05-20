import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private apiUrl = 'http://localhost:8080/api/sms'; // Update if backend URL differs

  constructor(private http: HttpClient) {}

  sendSms(to: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, { to, message });
  }

  sendBulkSms(numbers: string[], message: string): Observable<any[]> {
    const requests = numbers.map(num => this.sendSms(num, message));
    return new Observable(observer => {
      Promise.all(requests.map(r => r.toPromise()))
        .then(results => {
          observer.next(results);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
