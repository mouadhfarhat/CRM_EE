import { Demande } from "./demande.model";
import { Formation } from "./formation";
import { User } from "./user.model";

export interface Client extends User {


    address?: string;
    zip?: string;
    skills?: string;
    note?: string;
    history?: Formation[];  
    favorites?: Formation[];  
    certifications?: string;  
    interested?: Formation[]; 
    demandes?: Demande[];  
    selected?: boolean; 
  }
  