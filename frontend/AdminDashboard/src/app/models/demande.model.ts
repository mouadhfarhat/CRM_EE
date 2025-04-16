// src/app/models/demande.model.ts
import { DemandeType, DemandeStatut } from './enums';
import { Client } from './client.model';
import { Formation } from './formation.model';
import { Gestionnaire } from './gestionnaire.model';

export interface Demande {
  id: number;
  title: string;
  description: string;
  type: DemandeType;
  statut: DemandeStatut;
  createdAt: Date;
  client: Client;                  // Client who made the demande
  formation: Formation;            // Formation related to demande
  gestionnaireAssigne: Gestionnaire; // Assigned gestionnaire
  sharedWith?: Gestionnaire;       // Optional: Shared with another gestionnaire
  showDetails?: boolean;

}