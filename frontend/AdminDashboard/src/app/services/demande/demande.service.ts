import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from '../../domains/demande.model';
import { DemandeStatut, DemandeType } from '../../domains/enums';
  

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  
  private apiUrl = 'http://localhost:8080/demandes'; // adjust if your backend runs elsewhere

  constructor(private http: HttpClient) {}
  
  // Fetch unassigned demands
  getUnassignedDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/unassigned`);
  }

  // Assign a demand to the current gestionnaire
  assignDemande(demandeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${demandeId}/choose`, {});
  }

  // demande.service.ts
  getDemandesByGestionnaireId(gestionnaireId: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/gestionnaire/${gestionnaireId}`);
  }
  

  getAllDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/all`);
  }

  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.apiUrl}/${id}`);
  }

  createDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(`${this.apiUrl}/create`, demande);
  }

  updateDemandeStatus1(id: number, statut: DemandeStatut): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/update/${id}`, { statut });
  }

  deleteDemande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }

  updateDemandeStatus(demandeId: number, newStatus: string, gestionnaireId: number): Observable<any> {
    const params = new HttpParams()
      .set('newStatus', newStatus)
      .set('gestionnaireId', gestionnaireId.toString());
  
    return this.http.put(`${this.apiUrl}/${demandeId}/status`, null, { params });
  }
  updateDemandeStatut(demandeId: number, statut: DemandeStatut): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandeId}/statut`, { statut });
  }


  //search by all demande not the gestionnaie wa
  searchDemandes(
    title?: string,
    description?: string,
    clientName?: string,
    statut?: DemandeStatut,
    type?: DemandeType
  ): Observable<Demande[]> {
    let params = new HttpParams();
    
    if (title) params = params.append('title', title);
    if (description) params = params.append('description', description);
    if (clientName) params = params.append('clientName', clientName);
    if (statut) params = params.append('statut', statut);
    if (type) params = params.append('type', type);

    return this.http.get<Demande[]>(`${this.apiUrl}/search`, { params });
  }


  //search by the gestionnaire demande only

  // demande.service.ts
searchDemandesByGestionnaire(
  gestionnaireId: number,
  title?: string,
  description?: string,
  clientName?: string,
  statut?: DemandeStatut,
  type?: DemandeType
): Observable<Demande[]> {
  let params = new HttpParams();
  
  if (title) params = params.append('title', title);
  if (description) params = params.append('description', description);
  if (clientName) params = params.append('clientName', clientName);
  if (statut) params = params.append('statut', statut);
  if (type) params = params.append('type', type);

  return this.http.get<Demande[]>(
    `${this.apiUrl}/gestionnaire/${gestionnaireId}/search`, 
    { params }
  );
}
  
}
