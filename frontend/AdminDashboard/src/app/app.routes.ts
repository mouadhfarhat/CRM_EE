import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormationMangComponent } from './components/formation-mang/formation-mang.component';
import { ClientMangComponent } from './components/client-mang/client-mang.component';
import { GestionnaireMangComponent } from './components/gestionnaire-mang/gestionnaire-mang.component';
import { DemandeMangComponent } from './components/demande-mang/demande-mang.component';
import { ProfileComponent } from './components/profile-folder/profile/profile.component';
import { ClientInterfaceComponent } from './components/client-interface/client-interface.component';
import { AdminInterfaceComponent } from './components/admin-interface/admin-interface.component';

export const routes: Routes = [
         { path: 'login', component: LoginComponent },
         { path: 'admin', component: AdminInterfaceComponent },
         { path: 'formations', component: FormationMangComponent  },
         { path: 'clients', component: ClientMangComponent  },
         { path: 'demandes', component: DemandeMangComponent  },
         { path: 'gestionnaires', component: GestionnaireMangComponent  },
         { path: 'profile', component: ProfileComponent  },
         { path: '', component: ClientInterfaceComponent  },



];
