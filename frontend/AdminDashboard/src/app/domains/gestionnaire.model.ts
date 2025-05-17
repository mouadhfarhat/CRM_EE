// src/app/models/gestionnaire.model.ts
import { User } from './user.model';
import { DepartmentType } from './enums';
import { Demande } from './demande.model';

export interface Gestionnaire extends User {
  department: DepartmentType;
  assignedDemandes?: Demande[];      // Demandes assigned to this gestionnaire
  demandesSharedWithMe?: Demande[];  // Demandes shared with this gestionnaire
  keycloakId?:string
}