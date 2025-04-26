import { Client } from "./client";
import { Demande } from "./demande.model";

export interface Formation {
  id: number; // number
  code?: string;
  name: string;
  description: string;
  price?: number;
  quantity?: number;
  status?: string;
  category?: string;
  image?: string;
  rating?: number;
  title: string;
  dateDebut: Date;
  dateFin: Date;
  interestedClients?: Client[];  // Clients interested in this formation
  demandes?: Demande[];          // Demandes related to this formation
}