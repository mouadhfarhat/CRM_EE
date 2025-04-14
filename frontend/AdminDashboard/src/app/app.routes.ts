import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormationMangComponent } from './components/formation-mang/formation-mang.component';
import { ClientMangComponent } from './components/client-mang/client-mang.component';

export const routes: Routes = [
         { path: 'login', component: LoginComponent },
         { path: '', component: HomeComponent },
         { path: 'formations', component: FormationMangComponent  },
         { path: 'clients', component: ClientMangComponent  },

];
