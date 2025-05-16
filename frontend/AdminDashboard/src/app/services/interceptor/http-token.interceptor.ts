// src/app/services/interceptor/http-token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      console.log('Using token from sessionStorage');
      return next.handle(this.addToken(req, sessionToken));
    }

    if (this.keycloakService.keycloak) {
      return from(this.keycloakService.getToken()).pipe(
        mergeMap(token => {
          if (token) {
            console.log('Adding token from Keycloak:', token.substring(0, 20), '…');
            sessionStorage.setItem('token', token);
            return next.handle(this.addToken(req, token));
          }
          return next.handle(req);
        })
      );
    }

    console.warn('No token available, sending request without Authorization header');
    return next.handle(req);
  }

  private addToken(req: HttpRequest<unknown>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
