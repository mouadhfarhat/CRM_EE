import { NotificationType } from "./enums";

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
  }