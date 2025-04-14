import { Formation } from "./formation";

export interface Client {
    id?: string;  
    username?: string;
    image?: string;
    email?: string;
    password?: string;
    role?: string;
    domaine?: string;
    history?: Formation[];  // List of Formation objects
    favorites?: Formation[];  // List of Formation objects
    certifications?: string;  
  }
  