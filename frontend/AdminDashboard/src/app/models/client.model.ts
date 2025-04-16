// src/app/models/client.model.ts
import { User } from './user.model';
import { Formation } from './formation.model';
import { Demande } from './demande.model';

export interface Client extends User {
  interested?: Formation[];  // Formations the client is interested in
  demandes?: Demande[];     // Demandes created by this client
}
