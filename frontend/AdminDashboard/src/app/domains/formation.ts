import { SafeUrl } from "@angular/platform-browser";
import { Category } from "./category.model";
import { Client } from "./client";
import { Demande } from "./demande.model";
import { FoodCompany } from "./foodcompany.model";
import { Formateur } from "./formateur.model";

export interface Formation {
  id: number | null; // Primary key
  code?: string; // Optional, if used in the future
  name: string; // Required name
  title: string; // Required title
  description: string; // Required description
  price?: number; // Optional price
  dateDebut: string; // ISO string (e.g., "2025-05-14T00:32:00Z")
  dateFin: string; // ISO string (e.g., "2025-05-14T00:32:00Z")
  registrationEndDate: string; // ISO string (e.g., "2025-05-14T00:32:00Z")
  averageRating?: number; // Optional average rating (calculated server-side)
  imagePath?: string | null; // Optional image path or null
  fileName?: string | null; // Optional PDF file name or null
  category?: Category; // Optional category
  formateur?: Formateur; // Made optional to allow null during initialization
  foodCompany?: FoodCompany; // Made optional to allow null during initialization
  interestedClients?: Client[]; // Optional list of interested clients
  rating?:number;
  demandes?:Demande;
  titleExpanded?:Boolean;
  descExpanded?:Boolean;
}