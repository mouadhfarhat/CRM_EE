import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule

  ],  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  visible: boolean = false;
username: string = '';
password: string = '';

showDialog() {
  this.visible = true;
}

closeDialog() {
  this.visible = false;
}

login() {
  console.log('Logging in with', this.username, this.password);
  this.closeDialog();
}

}
