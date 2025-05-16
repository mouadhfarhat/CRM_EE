import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Demande } from '../../../domains/demande.model';
import { DemandeService } from '../../../services/demande/demande.service';

@Component({
  selector: 'app-my-demandes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './my-demandes.component.html',
  styleUrl: './my-demandes.component.css'
})
export class MyDemandesComponent implements OnInit {
  demandes: Demande[] = [];

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.fetchDemandes();
  }

  fetchDemandes(): void {
    this.demandeService.getMyDemandes().subscribe({
      next: (data) => {
        this.demandes = data;
      },
      error: (err) => {
        console.error('Failed to fetch demandes:', err);
      }
    });
  }

  onView(demandeId: number): void {
    console.log('Viewing demande', demandeId);
    // navigate or show modal
  }

  onEdit(demandeId: number): void {
    console.log('Editing demande', demandeId);
    // navigate or show modal
  }

  onDelete(demandeId: number): void {
    if (!confirm('Are you sure you want to delete this demande?')) return;
  
    this.demandeService.deleteDemande(demandeId).subscribe({
      next: () => {
        this.demandes = this.demandes.filter(d => d.id !== demandeId);
        console.log('Demande deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting demande:', err);
        alert('Failed to delete demande.');
      }
    });
  }
  
}
