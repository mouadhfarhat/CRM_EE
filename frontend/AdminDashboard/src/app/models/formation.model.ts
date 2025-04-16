// src/app/models/formation.model.ts
import { Client } from './client.model';
import { Demande } from './demande.model';

export interface Formation {
  id: number;
  name: string;
  title: string;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  interestedClients?: Client[];  // Clients interested in this formation
  demandes?: Demande[];          // Demandes related to this formation
}