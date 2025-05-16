import { Formation } from "./formation";

export interface ClientGroup {
  id: number;
  name: string;
  clients?: any[];
  formation?:Formation
}