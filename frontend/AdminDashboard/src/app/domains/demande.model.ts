// src/app/models/demande.model.ts
import { Client } from './client';
import { DemandeType, DemandeStatut } from './enums';
import { Formation } from './formation';
import { Gestionnaire } from './gestionnaire.model';
import { Task } from './Task.model';


export interface Demande {
  selected: any;
  id: number;
  title: string;
  description: string;
  type: DemandeType;
  statut: DemandeStatut;
  createdAt: Date;
  client: Client;
  formation: Formation;            // Formation related to demande
  gestionnaireAssigne: Gestionnaire; // Assigned gestionnaire
  sharedWith?: Gestionnaire;       // Optional: Shared with another gestionnaire
  showDetails?: boolean;
  tasks?: Task[];

}