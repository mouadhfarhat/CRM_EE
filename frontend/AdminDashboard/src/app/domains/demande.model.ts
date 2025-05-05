// src/app/models/demande.model.ts
import { Client } from './client';
import { DemandeType, DemandeStatut } from './enums';
import { Formation } from './formation';
import { Gestionnaire } from './gestionnaire.model';


export interface Demande {
  selected: any;
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