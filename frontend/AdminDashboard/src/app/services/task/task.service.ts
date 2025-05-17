import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../domains/Task.model';
import { Demande } from '../../domains/demande.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  addTaskToDemande(demandeId: number, gestionnaireId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/add/${demandeId}/${gestionnaireId}`, task);
  }

  getTasksByDemande(demandeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/by-demande/${demandeId}`);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${taskId}`);
  }

  getDemandesWithTasksByGestionnaire(gestionnaireId: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.baseUrl}/demandes-with-tasks/by-gestionnaire/${gestionnaireId}`);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task); // Make sure this matches your backend PUT route if implemented
  }
}
