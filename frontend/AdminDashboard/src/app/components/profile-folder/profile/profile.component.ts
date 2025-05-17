import { Component, OnInit } from '@angular/core';
import { MyDemandesComponent } from '../my-demandes/my-demandes.component';
import { HistoriqueComponent } from '../historique/historique.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { NotificationHistoriqueComponent } from "../notification-historique/notification-historique.component";
import { UpdateProfileComponent } from '../update-prodile/update-prodile.component';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../../../domains/client';
import { CommonModule } from '@angular/common';
import { TodolistComponent } from "../todolist/todolist.component"; // ✅ import this
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MyDemandesComponent, HistoriqueComponent, UpdateProfileComponent, AboutMeComponent, NotificationHistoriqueComponent, TodolistComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username = '';
  firstname = '';
  lastname = '';
  phoneNumber = '';
  role = '';
  demandesCount = 0;
  formationsCount = 0;
  clientId?: number;
  client?: Client; // Add this to the top of the class
  imageSrc: any = ''; // store image blob URL
  userId?: number; // internal user ID (e.g. client.id, gestionnaire.id, admin.id)
keycloakId?: string; // from token.sub


  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient,
    private sanitizer: DomSanitizer

  ) {}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const routeId = params.get('id');

    if (routeId) {
      // Someone else's profile (e.g. /profile/101)
      const id = Number(routeId);
      if (!isNaN(id)) {
        this.loadClient(id); // Assuming only clients are viewed this way
        this.clientId = id;
      }
    } else {
      // Own profile
      const role = this.auth.role;
      if (role === 'CLIENT') {
        this.auth.getClientId().subscribe(id => {
          this.clientId = id;
          this.loadClient(id);
        });
      } else {
        this.loadUserInfoFromToken(); // For GESTIONNAIRE or ADMIN
      }
    }
  });
}


loadUserInfoFromToken() {
  const decoded = this.auth['decodedToken'];
  this.username = decoded?.['preferred_username'] || '';
  this.firstname = decoded?.['given_name'] || '';
  this.lastname = decoded?.['family_name'] || '';
  this.phoneNumber = decoded?.['phone_number'] || '';
  this.role = this.auth.role;
  this.keycloakId = decoded?.['sub']; // ✅ Store the Keycloak ID

  if (this.keycloakId) {
    this.http.get<any>(`http://localhost:8080/api/users/${this.keycloakId}`).subscribe(user => {
      this.userId = user.id; // ✅ Internal app-specific ID
      this.loadProfileImage(user.imageUrl);
    });
  }
}




loadClient(clientId: number) {
  if (this.client?.id === clientId) return; // Already loaded

  this.http.get<Client>(`http://localhost:8080/api/clients/${clientId}`).subscribe(user => {
    this.client = user;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.phoneNumber = user.phoneNumber;
    this.loadProfileImage(user.imageUrl);
  });

  this.http.get<{ count: number }>(`http://localhost:8080/api/users/me/${clientId}/demandes/count`)
    .subscribe(res => this.demandesCount = res.count);

  this.http.get<{ count: number }>(`http://localhost:8080/api/users/me/${clientId}/formations/count`)
    .subscribe(res => this.formationsCount = res.count);
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


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length || !this.userId) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  this.http.put<{ imageUrl: string }>(
    `http://localhost:8080/api/users/${this.userId}/upload-image`,
    formData
  ).subscribe({
    next: (response) => {
      this.loadProfileImage(response.imageUrl);
    },
    error: err => console.error('Image upload failed:', err)
  });
}







getInterestsFormatted(client: Client): string {
  return client.interested?.map(f => f.title).join(', ') || 'No interests';
}



}
