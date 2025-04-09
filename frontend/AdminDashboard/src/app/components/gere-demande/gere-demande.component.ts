import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SideBarComponent } from "../side-bar/side-bar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-gere-demande',
  imports: [NavbarComponent, SideBarComponent, FooterComponent],
  templateUrl: './gere-demande.component.html',
  styleUrl: './gere-demande.component.css'
})
export class GereDemandeComponent {

}
