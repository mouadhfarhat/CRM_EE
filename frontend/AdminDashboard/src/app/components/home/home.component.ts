import { Component } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard1/dashboard.component';
import { Dashboard2Component } from '../dashboard/dashboard2/dashboard2.component';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-home',
  imports: [
    DashboardComponent, 
    Dashboard2Component,
    RouterLink , 
    NavbarComponent, 
    SidebarComponent
  
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
