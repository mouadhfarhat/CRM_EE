import { CalendrierEvent } from "./CalendrierEvent .model";

export interface CalendarDisplayEvent {
    id?: number;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    borderColor?: string;
    extendedProps?: {
      fullEvent: CalendrierEvent;
    };
  }
  