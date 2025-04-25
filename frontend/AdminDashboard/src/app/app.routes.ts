import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GereDemandeComponent } from './components/gere-demande/gere-demande.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
import { ClientGestionnaireComponent } from './components/client-gestionnaire/client-gestionnaire.component';

export const routes: Routes = [
     { path: 'login', component: LoginComponent },
     { path: '', component: HomeComponent },
     { path: 'gere-demande', component: GereDemandeComponent },
     { path: 'calendrier' , component: CalendrierComponent},
     { path: 'list-client' , component: ClientGestionnaireComponent}
     

];
