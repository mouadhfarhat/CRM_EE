// src/app/models/enums.ts
export enum DemandeType {
    REJOINDRE = 'REJOINDRE',
    ADMINISTRATIVE = 'ADMINISTRATIVE',
    RECLAMATION = 'RECLAMATION'
  }
  
  export enum DemandeStatut {
    EN_ATTENTE = 'EN_ATTENTE',
    EN_COURS = 'EN_COURS',
    TERMINE = 'TERMINE',
    REFUSE = 'REFUSE'
  }
  
  export enum DepartmentType {
    REJOINDRE = 'REJOINDRE',
    ADMINISTRATIVE = 'ADMINISTRATIVE',
    RECLAMATION = 'RECLAMATION'
  }

  export enum EventType {
    MEETING = 'MEETING',
    TRAINING = 'TRAINING',
    PRESENTATION = 'PRESENTATION',
    OTHER = 'OTHER'
  }
  
  export enum RecurrenceType {
    NONE = 'NONE',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
  }
  
  export enum EventStatus {
    SCHEDULED = 'SCHEDULED',
    CANCELLED = 'CANCELLED',
    POSTPONED = 'POSTPONED'
  }