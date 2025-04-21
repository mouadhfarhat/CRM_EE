import { Component } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard1/dashboard.component';
import { Dashboard2Component } from '../dashboard/dashboard2/dashboard2.component';

@Component({
  selector: 'app-admin-interface',
  standalone: true,
  imports: [    DashboardComponent, 
      Dashboard2Component,],
  templateUrl: './admin-interface.component.html',
  styleUrl: './admin-interface.component.css'
})
export class AdminInterfaceComponent {

}
