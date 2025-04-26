import { Attachment } from "./Attachment.model";
import { Client } from "./client";
import { EventStatus, EventType, RecurrenceType } from "./enums";
import { Formation } from "./formation";
import { Gestionnaire } from "./gestionnaire.model";

export interface CalendrierEvent {
  id?: number;
  title: string;
  startTime: string; // ISO strings for easier JSON mapping
  endTime: string;
  type: EventType;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  status: EventStatus;
  reminderMinutesBefore?: number;
  gestionnaire?: Gestionnaire;
  clients?: Client[];
  formation?: Formation;
  attachments?: Attachment[];
  backgroundColor?: string;
  borderColor?: string;
  
}