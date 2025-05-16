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
    OTHER = 'OTHER',
    MEETING = 'MEETING',
    TRAINING = 'TRAINING',
    PRESENTATION = 'PRESENTATION',
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

  export enum NotificationType {
    NEW_COURSE = 'NEW_COURSE',
    GROUP_CREATED = 'GROUP_CREATED',
    CALENDAR_EVENT = 'CALENDAR_EVENT',
    REMINDER = 'REMINDER',
    STATUS_UPDATE = 'STATUS_UPDATE',
    RATING_REQUEST = 'RATING_REQUEST'
  }