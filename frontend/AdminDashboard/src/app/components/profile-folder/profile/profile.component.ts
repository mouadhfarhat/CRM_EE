import { Component } from '@angular/core';
import { MyDemandesComponent } from '../my-demandes/my-demandes.component';
 import { HistoriqueComponent } from '../historique/historique.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyDemandesComponent, HistoriqueComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}


