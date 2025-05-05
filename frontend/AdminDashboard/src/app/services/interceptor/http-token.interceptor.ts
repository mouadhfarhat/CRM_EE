import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, mergeMap } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  
  // First check sessionStorage synchronously
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken) {
    console.log('Using token from sessionStorage');
    return next(addTokenToRequest(req, sessionToken));
  }

  // If no token in sessionStorage and Keycloak is available
  if (keycloakService.keycloak) {
    return from(keycloakService.getToken()).pipe(
      mergeMap(token => {
        if (token) {
          console.log('Adding token from Keycloak:', token.substring(0, 20) + '...');
          sessionStorage.setItem('token', token); // Cache the token
          return next(addTokenToRequest(req, token));
        }
        console.warn('No token available from Keycloak');
        return next(req);
      })
    );
  }

  console.warn('No token available, sending request without Authorization header');
  return next(req);
};

// Helper function to add token to request
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}