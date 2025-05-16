import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Router, RouterLink } from '@angular/router';

import { FormationService } from '../../../services/formation/formation.service';
import { DemandeService }   from '../../../services/demande/demande.service';
import { Formation }        from '../../../domains/formation';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RatingModule,
    TagModule,
    ButtonModule,
    DialogModule,
    SelectButtonModule,
    RouterLink
  ],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  formations: Formation[] = [];
  loading = true;
  error: string| null = null;

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.demandeService.getHistorique().subscribe({
      next: data => {
        console.log('historique payload:', data);
        this.formations = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading history', err);
        this.error = err.message || 'Server error';
        this.loading = false;
      }
    });
  }
  // Called whenever the user clicks a star
  onRatingChange(formation: Formation, value: number): void {
    if (!formation.id) return;
    this.demandeService.submitRating(formation.id, value).subscribe({
      next: () => console.log(`Rated formation ${formation.title} = ${value}`),
      error: e => console.error('Rating failed', e)
    });
  }
}
