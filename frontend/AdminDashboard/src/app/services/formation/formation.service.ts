import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Formation } from '../../domains/formation';
import { ClientGroup } from '../../domains/clients-group.model';

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


 getFormationsByCategory(categoryId: number): Observable<Formation[]> {
  return this.http.get<Formation[]>(`${this.apiUrl}/by-category/${categoryId}`);
}


 getAll(): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(this.apiUrl);
  }

  searchByName(term: string): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(`${this.apiUrl}/searchByName`, { params: { name: term } });
  }

  getByFormation(formationId: number): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(`${this.apiUrl}/by-formation/${formationId}`);
  }

  addClient(groupId: number, clientId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/clients/${clientId}`, {});
  }

  removeClient(groupId: number, clientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}/clients/${clientId}`);
  }

  countClients(groupId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${groupId}/clients/count`);
  }
  countClientss(formationId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/${formationId}/clients/count`);
}

getFormationStats(formationId: number) {
  return this.http.get<{ groupCount: number, demandeClientCount: number }>(`${this.apiUrl}/${formationId}/stats`);
}

/*
createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }
  updateFormation(id: number, formation: Formation): Observable<Formation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation, { headers });
  }*/

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  createFormation(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, formData);
    }

    updateFormation(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, formData);
    }


    getImage(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/images/${fileName}`, {
      responseType: 'blob'
    });
  }
  getImage1(fileName: string): Observable<string> {
  return of(`${this.apiUrl}/images/${fileName}`);
}

  // New method to fetch a PDF as a blob
  getFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/${fileName}`, {
      responseType: 'blob'
    });
  }


  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }


  updateFormation1(formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formation.id}`, formation);
  }
markInterest(formationId: number): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(`${this.apiUrl}/${formationId}/interest`, {});
}

unmarkInterest(formationId: number): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.apiUrl}/${formationId}/interest`);
}

getInterestedFormations(): Observable<number[]> {
  return this.http.get<number[]>(`${this.apiUrl}/interested`);
}



}


    
