import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandeType } from '../../../domains/enums';
import { DemandeService } from '../../../services/demande/demande.service';
import { Client } from '../../../domains/client';
import { Formation } from '../../../domains/formation';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.css'],
  standalone: true,
  imports: [FormsModule] // ✅ Include FormsModule here

})
export class ComposeMailComponent implements OnInit {
  clientId: number | null = null;
  formationId: number | null = null;

  title: string = '';
  description: string = '';
  type: DemandeType | null = null;

  demandeTypes = Object.values(DemandeType);

  constructor(
    private route: ActivatedRoute,
    private demandeService: DemandeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.clientId = +params['clientId'] || null;
      this.formationId = +params['formationId'] || null;

      console.log('Client ID:', this.clientId);
      console.log('Formation ID:', this.formationId);
    });
  }

  sendDemande(): void {
    if (!this.title || !this.description || !this.type || !this.clientId || !this.formationId) {
      alert('All fields are required!');
      return;
    }

    const client: Client = { id: this.clientId } as Client;
    const formation: Formation = { id: this.formationId } as Formation;

    this.demandeService.createDemande({
      title: this.title,
      description: this.description,
      type: this.type,
      client,
      formation
    }).subscribe({
      next: response => {
        alert('Demande sent successfully!');
        console.log(response);
      },
      error: err => {
        console.error(err);
        alert('Failed to send demande.');
      }
    });
  }
}
