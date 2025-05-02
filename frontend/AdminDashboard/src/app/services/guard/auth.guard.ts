import {CanActivateFn, Router} from '@angular/router';
import {TokenService} from '../token/token.service';
import {inject} from '@angular/core';
import {KeycloakService} from '../keycloak/keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  const loggedIn = await keycloakService.isLoggedIn();
  console.log('AuthGuard - Is User Logged In?', loggedIn);

  if (!loggedIn) {
    console.log('Redirecting to Keycloak login...');
    keycloakService.login(); // Redirect to Keycloak login page
    return false;
  }

  return true;
};
