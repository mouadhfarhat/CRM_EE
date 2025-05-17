import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from '../../domains/demande.model';
import { DemandeStatut, DemandeType } from '../../domains/enums';
import { Formation } from '../../domains/formation';
import { Client } from '../../domains/client';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = 'http://localhost:8080/demandes';

  constructor(private http: HttpClient) {}

  getUnassignedDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/unassigned`);
  }

  assignDemande(demandeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${demandeId}/choose`, {});
  }

  getDemandesByGestionnaireId(gestionnaireId: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/gestionnaire/${gestionnaireId}`);
  }

  getAllDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/all`);
  }

  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.apiUrl}/${id}`);
  }

  updateDemande(demande: Demande): Observable<Demande> {
  return this.http.put<Demande>(`${this.apiUrl}/update-full/${demande.id}`, demande);
}


  createDemande(demande: { title: string, description: string, type: DemandeType, client: Client, formation: Formation }): Observable<Demande> {
    const demandeRequest = {
      title: demande.title,
      description: demande.description,
      type: demande.type,
      client: { id: demande.client.id },
      formation: { id: demande.formation.id }
    };
    return this.http.post<Demande>(`${this.apiUrl}/create`, demandeRequest);
  }

  updateDemandeStatus1(id: number, statut: DemandeStatut): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/update/${id}`, { statut });
  }

  deleteDemande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
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

  getMyDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/my`);
  }

  getHistorique(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/historique`);
  }

  submitRating(demandeId: number, value: number) {
    return this.http.put(
      `${this.apiUrl}/${demandeId}/rate`,
      null,
      { params: { value } }
    );
  }

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