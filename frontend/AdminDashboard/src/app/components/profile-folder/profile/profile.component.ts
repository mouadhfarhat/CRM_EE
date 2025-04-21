import { Component } from '@angular/core';
import { MyDemandesComponent } from '../my-demandes/my-demandes.component';
import { HistoriqueComponent } from '../historique/historique.component';
import { UpdateProdileComponent } from '../update-prodile/update-prodile.component';
import { AboutMeComponent } from '../about-me/about-me.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyDemandesComponent, HistoriqueComponent, UpdateProdileComponent, AboutMeComponent ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}


