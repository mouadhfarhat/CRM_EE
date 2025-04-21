import { Formation } from "./formation";

export interface Client {
    id?: string;  
    username?: string;
    image?: string;
    email?: string;
    password?: string;
    role?: string;
    address?: string;
    zip?: string;
    skills?: string;
    note?: string;
    history?: Formation[];  
    favorites?: Formation[];  
    certifications?: string;  
  }
  