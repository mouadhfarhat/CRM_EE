import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../services/role/role.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service'; // Import KeycloakService

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true
})
export class SidebarComponent implements OnInit {
  username: string = '';
  role: string = 'visitor';

  constructor(
    private roleService: RoleService,
    private keycloakService: KeycloakService
  ) {
    this.roleService.role$.subscribe((r) => (this.role = r));
  }

  async ngOnInit() {
    // Get username from Keycloak profile
    if (await this.keycloakService.isLoggedIn()) {
      const profile = this.keycloakService.profile;
      this.username = profile?.username || 
                     profile?.username || 
                     'My Profile'; // Fallback
    }
  }
}