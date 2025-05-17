import { Component, OnInit } from '@angular/core';
import { Demande } from '../../../domains/demande.model';
import { TaskService } from '../../../services/task/task.service';
import { Task } from '../../../domains/Task.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css',
})
export class TodolistComponent implements OnInit {
  demandesWithTasks: Demande[] = [];
  currentGestionnaireId: number | null = null;
  selectedDemandeId: number | null = null;

  constructor(private taskService: TaskService, private http: HttpClient,  private router: Router // Inject Router
) {}

  ngOnInit(): void {
    this.fetchCurrentGestionnaireAndLoadTasks();
  }

  fetchCurrentGestionnaireAndLoadTasks(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error("Token not found in sessionStorage");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/gestionnaires/me', { headers }).subscribe({
      next: (g) => {
        this.currentGestionnaireId = g.id;
        this.loadDemandesWithTasks(g.id);
      },
      error: (err) => {
        console.error("Failed to fetch current gestionnaire", err);
      }
    });
  }

  loadDemandesWithTasks(gestionnaireId: number): void {
    this.taskService.getDemandesWithTasksByGestionnaire(gestionnaireId).subscribe({
      next: (demandes: Demande[]) => {
        this.demandesWithTasks = demandes.filter(d => d.tasks && d.tasks.length > 0);
      },
      error: err => console.error('Erreur de chargement des demandes avec tâches', err)
    });
  }

  markAsDone(task: Task): void {
    task.completed = true;
    this.taskService.updateTask(task.id!, task).subscribe({
      next: () => {},
      error: err => console.error('Erreur lors de la mise à jour de la tâche', err)
    });
  }

  deleteTask(taskId: number, demandeId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        const demande = this.demandesWithTasks.find(d => d.id === demandeId);
        if (demande?.tasks) {
          demande.tasks = demande.tasks.filter(t => t.id !== taskId);
        }
      },
      error: err => console.error('Erreur lors de la suppression de la tâche', err)
    });
  }


goToGere(demande: Demande) {
  this.router.navigate(['/gere'], { queryParams: { selectedId: demande.id } });
}

/*
confirmDeleteTask(taskId: number, demandeId: number) {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette tâche sera définitivement supprimée.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteTask(taskId, demandeId);
      Swal.fire('Supprimée !', 'La tâche a été supprimée.', 'success');
    }
  });
}*/
/*
confirmDeleteTask(taskId: number, demandeId: number) {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette tâche sera définitivement supprimée.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result: SweetAlertResult) => {
    if (result.isConfirmed) {
      // Show progress/loading line
      Swal.fire({
        title: 'Suppression en cours...',
        text: 'Veuillez patienter.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          const demande = this.demandesWithTasks.find(d => d.id === demandeId);
          if (demande?.tasks) {
            demande.tasks = demande.tasks.filter(t => t.id !== taskId);
          }

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Supprimée !',
            text: 'La tâche a été supprimée avec succès.'
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la suppression.'
          });
        }
      });
    }
  });
}
*/

confirmDeleteTask(task: Task, demandeId: number): void {
  // Add a soft deletion effect
  task.completed = true;

  // Wait for animation, then remove permanently
  setTimeout(() => {
    this.taskService.deleteTask(task.id!).subscribe({
      next: () => {
        const demande = this.demandesWithTasks.find(d => d.id === demandeId);
        if (demande?.tasks) {
          demande.tasks = demande.tasks.filter(t => t.id !== task.id);
        }
      },
      error: err => {
        console.error('Erreur de suppression:', err);
        task.completed = false; // rollback UI if error occurs
      }
    });
  }, 1500); // delay gives user time to see visual feedback
}

}
