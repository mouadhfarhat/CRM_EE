// client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../domains/client';
import { Observable } from 'rxjs';
import { Formation } from '../../domains/formation';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients'; // adjust to your backend URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchClients(username: string): Observable<Client[]> {
    console.log('Searching clients with term:', username); // Debugging log
    return this.http.get<Client[]>(`${this.apiUrl}/search`, {
      params: { username }
    });
  }

  getInterests(client: Client): string {
    if (!client.interested || client.interested.length === 0) {
      return 'No interests listed';
    }
    return client.interested.map(f => f.title).join(', ');
  }
  
  searchClientsByFormationAndType(formationId: number, type: string): Observable<Client[]> {
    return this.http.get<Client[]>(`http://localhost:8080/demandes/search2?formationId=${formationId}&type=${type}`);
  }


  search(username: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search`, { params: { username } });
  }

  getByFormation(formationId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/by-formation/${formationId}`);
  }

  getByGroup(groupId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/by-group/${groupId}`);
  }
  getAlll(): Observable<Formation[]> {  // Correct return type
  return this.http.get<Formation[]>(this.apiUrl);
}
  
getClientsInterestedInFormation(formationId: number): Observable<Client[]> {
  return this.http.get<Client[]>(`${this.apiUrl}/interested-in/${formationId}`);
}


}
