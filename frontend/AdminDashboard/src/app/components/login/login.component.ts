import { Component, OnDestroy } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TestUser, TEST_USERS  } from '../../domains/test-users';
import { RoleService } from '../../services/role/role.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-login',
  imports: [DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CommonModule,
  ButtonModule

  ],  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
 
})
export class LoginComponent {
  visible: boolean = false;
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private roleService: RoleService) {}

  // Opens the dialog
  showDialog() {
    this.visible = true;
  }

  // Closes the dialog and resets any error messages if needed
  closeDialog() {
    this.visible = false;
    this.errorMessage = '';
  }

  // Validates input using the static test user list and updates the role accordingly
  login() {
    const foundUser: TestUser | undefined = TEST_USERS.find(
      (user) => user.username === this.username && user.password === this.password
    );

    if (foundUser) {
      this.roleService.setRole(foundUser.role);
      console.log(`Login successful: ${foundUser.username} (${foundUser.role})`);
      this.errorMessage = '';
      // Optionally, clear the form fields
      this.username = '';
      this.password = '';
      this.closeDialog();
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }

 
}
