import { Component } from '@angular/core';

import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
@Component({
  selector: 'app-home',
  imports: [DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
