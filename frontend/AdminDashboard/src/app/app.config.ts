import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragDropModule } from 'primeng/dragdrop';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { HttpTokenInterceptor } from './services/interceptor/http-token.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Keycloak initialization factory
export function kcFactory(kcService: KeycloakService) {
  return () => {
    console.log("🚀 kcFactory: Starting Keycloak Initialization...");
    if (typeof window === 'undefined') {
      console.warn("⚠️ Skipping Keycloak initialization (SSR detected).");
      return Promise.resolve();
    }
    return kcService.init();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, DragDropModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true
    }
  ]
};
