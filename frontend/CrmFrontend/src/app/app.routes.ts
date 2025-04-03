import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormationComponent } from './components/formation/formation.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'formation', component: FormationComponent },


];
