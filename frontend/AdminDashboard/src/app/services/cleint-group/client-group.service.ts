import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientGroup } from '../../domains/clients-group.model';
import { Client } from '../../domains/client';

@Injectable({
  providedIn: 'root'
})
export class ClientGroupService {
  private baseUrl = 'http://localhost:8080/api/groups';

  constructor(private http: HttpClient) {}

  searchGroups(searchTerm: string): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(`${this.baseUrl}/search?term=${encodeURIComponent(searchTerm)}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching groups:', error);
          return of([]);
        })
      );
  }

  // Added method to fetch groups by formation ID
  getGroupsByFormation(formationId: number): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(`${this.baseUrl}/by-formation/${formationId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching groups by formation:', error);
          return of([]);
        })
      );
  }
  getAll(): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(this.baseUrl);
  }

  searchByName(term: string): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(`${this.baseUrl}/searchByName`, { params: { name: term } });
  }

  getByFormation(formationId: number): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(`${this.baseUrl}/by-formation/${formationId}`);
  }

  addClient(groupId: number, clientId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${groupId}/clients/${clientId}`, {});
  }

  removeClient(groupId: number, clientId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}/clients/${clientId}`);
  }

  countClients(groupId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${groupId}/clients/count`);
  }
  
  deleteGroup(groupId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${groupId}`);
}

removeClientFromGroup(groupId: number, clientId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${groupId}/clients/${clientId}`);
}

getEligibleClients(formationId: number): Observable<Client[]> {
  return this.http.get<Client[]>(`${this.baseUrl}/demandes/eligible?formationId=${formationId}`);
}

addClientToGroup(groupId: number, clientId: number): Observable<void> {
  return this.http.post<void>(`${this.baseUrl}/${groupId}/clients/${clientId}`, {});
}



}