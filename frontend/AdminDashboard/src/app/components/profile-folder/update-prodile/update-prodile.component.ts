import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { UserProfile } from '../../../services/keycloak/user-profile';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './update-prodile.component.html',
  styleUrl: './update-prodile.component.css',
})
export class UpdateProfileComponent implements OnInit {
  userProfile: any = {}; // Add phoneNumber here too

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService,
      private cdRef: ChangeDetectorRef


  ) {}

async ngOnInit() {
  try {
    const profile = await this.keycloakService.loadUserProfile();
    console.log("the profile aaa", profile);

    // Assign a completely new object
    this.userProfile = {
      username: profile.username,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: (profile.attributes?.['phone_number'] as string[] | undefined)?.[0] || ''
    };

    console.log("Phone number set to:", this.userProfile.phoneNumber);

  } catch (error) {
    console.error('Failed to load profile', error);
  }
}




  onSubmit() {
        console.log("2",this.userProfile.phoneNumber);

    const updateData = {
      firstname: this.userProfile.firstName,
      lastname: this.userProfile.lastName,
      email: this.userProfile.email,
      
      phoneNumber: this.userProfile.phoneNumber
    };

    this.userService.updateUserProfile(updateData).subscribe({
      next: () => alert('Profile updated successfully!'),
      error: (err) => console.error('Update failed', err)
    });
  }

  goToKeycloakAccountPage() {
    window.location.href = 'http://localhost:8090/realms/crm/account';
  }
  
}