import { Component } from '@angular/core';
import { HeadlinesComponent } from '../headlines/headlines.component';
import { MonthlyRecapComponent } from '../monthly-recap/monthly-recap.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeadlinesComponent,
    MonthlyRecapComponent,
   

],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone:true
})
export class DashboardComponent {

}
