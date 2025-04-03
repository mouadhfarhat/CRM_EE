import { Component } from '@angular/core';
import { FormationComponent } from '../formation/formation.component';
@Component({
  selector: 'app-home',
  imports: [ FormationComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
