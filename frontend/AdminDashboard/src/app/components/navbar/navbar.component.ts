import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-navbar',
  imports: [DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    LoginComponent

  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent {
  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapse');
  }

  

  
}
