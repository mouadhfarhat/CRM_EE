import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/usersk/me';

  constructor(private http: HttpClient) {}

  updateUserProfile(data: any): Observable<any> {
    return this.http.put(this.baseUrl, data);
  }
}
