import { Component, OnInit } from '@angular/core';
import { MyDemandesComponent } from '../my-demandes/my-demandes.component';
import { HistoriqueComponent } from '../historique/historique.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { NotificationHistoriqueComponent } from "../notification-historique/notification-historique.component";
import { UpdateProfileComponent } from '../update-prodile/update-prodile.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyDemandesComponent, HistoriqueComponent,UpdateProfileComponent, AboutMeComponent, NotificationHistoriqueComponent],
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

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;

    if (this.clientId) {
      this.http.get<any>(`http://localhost:8080/api/clients/${this.clientId}`).subscribe(user => {
        this.username = user.username;
        this.role = user.role;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.phoneNumber = user.phoneNumber;
      });

      this.http.get<{ count: number }>(`http://localhost:8080/api/users/me/${this.clientId}/demandes/count`)
        .subscribe(res => this.demandesCount = res.count);

      this.http.get<{ count: number }>(`http://localhost:8080/api/users/me/${this.clientId}/formations/count`)
        .subscribe(res => this.formationsCount = res.count);
    } else {
      this.username = this.auth.username;
      this.role = this.auth.role;


      this.http.get<{ count: number }>('http://localhost:8080/api/users/me/demandes/count')
        .subscribe(res => this.demandesCount = res.count);

      this.http.get<{ count: number }>('http://localhost:8080/api/users/me/formations/count')
        .subscribe(res => this.formationsCount = res.count);
    }
  }
}
