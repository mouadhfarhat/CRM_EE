import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../services/role/role.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service'; // Import KeycloakService
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../domains/client';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true
})
export class SidebarComponent implements OnInit, AfterViewInit {
  username: string = '';
  role: string = 'visitor';
  imageSrc: any = '';
  clientId?: number;


  constructor(
    private roleService: RoleService,
    private keycloakService: KeycloakService,
    private auth: AuthService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
    
    
  ) {
    this.roleService.role$.subscribe((r) => (this.role = r));
  }

async ngOnInit() {
  if (await this.keycloakService.isLoggedIn()) {
    const profile = this.keycloakService.profile;
    this.username = profile?.username || 'My Profile';

    const keycloakId = this.keycloakService.getKeycloakId();
    if (keycloakId) {
      this.loadUserImage(keycloakId);
    } else {
      console.warn("Keycloak ID is undefined");
    }
  }
}

loadUserImage(keycloakId: string) {
  this.http.get<any>(`http://localhost:8080/api/users/${keycloakId}`).subscribe(user => {
    const imageUrl = user.imageUrl;
    this.loadProfileImage(imageUrl);
  });
}

loadProfileImage(imageUrl?: string) {
  const url = imageUrl
    ? `http://localhost:8080${imageUrl}?t=${new Date().getTime()}`
    : `http://localhost:8080/images/users/default.png`;

  this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
    const objectURL = URL.createObjectURL(blob);
    this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  });
}


  ngAfterViewInit(): void {
    // Re-initialize AdminLTE widgets like sidebar, dropdowns, etc.
    $('[data-widget="treeview"]').Treeview?.('init'); // Safe call if Treeview is available
    $('[data-widget="sidebar-search"]').SidebarSearch?.(); // For sidebar search plugin
  }
}





  
