import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { RoleService } from '../../services/role/role.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
@Component({
  selector: 'app-navbar',
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    LoginComponent,
    NgIf,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // note: corrected from styleUrl to styleUrls
  standalone: true
})
export class NavbarComponent {
  role: string = 'visitor'; // 'visitor', 'client', 'gestionnaire', 'admin'

  constructor(private keycloakService: KeycloakService,private roleService: RoleService) {
    this.roleService.role$.subscribe((r) => (this.role = r));
  }

  // This method is used to simulate a role change (login/logout)
  simulateLogin(role: string) {
    this.roleService.setRole(role as any);
  }

  // Example method called from the favorites button (client)
  show() {
    console.log('Show favorite products dialog');
    // You can add your dialog logic for displaying favorite products here.
  }

  // Example method for logout action (client)
  onLogout(): void {
    this.keycloakService.logout();

  }
  
  

  // Method to toggle the sidebar (if needed)
  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapse');
  }
}
