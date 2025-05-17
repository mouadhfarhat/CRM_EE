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
import { CommonModule } from '@angular/common'; // ✅ import this


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,MyDemandesComponent, HistoriqueComponent,UpdateProfileComponent, AboutMeComponent, NotificationHistoriqueComponent],
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

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient
  ) {}

ngOnInit() {
  this.clientId = +this.route.snapshot.paramMap.get('id')!;

  if (this.clientId) {
    this.loadClient(this.clientId);
  } else {
    this.auth.getClientId().subscribe(id => {
      this.clientId = id;
      this.loadClient(id);
    });
  }
}

loadClient(clientId: number) {
  this.http.get<Client>(`http://localhost:8080/api/clients/${clientId}`).subscribe(user => {
    this.client = user;
    this.username = user.username;
      this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.phoneNumber = user.phoneNumber;
  });

  this.http.get<{ count: number }>(`http://localhost:8080/api/users/me/${clientId}/demandes/count`)
    .subscribe(res => this.demandesCount = res.count);

  this.http.get<{ count: number }>(`http://localhost:8080/api/users/me/${clientId}/formations/count`)
    .subscribe(res => this.formationsCount = res.count);
}


getInterestsFormatted(client: Client): string {
  return client.interested?.map(f => f.title).join(', ') || 'No interests';
}



}
