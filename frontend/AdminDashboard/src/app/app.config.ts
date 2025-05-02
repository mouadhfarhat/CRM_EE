import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection,APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragDropModule } from 'primeng/dragdrop';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';


// Import Keycloak service
import { KeycloakService } from './services/keycloak/keycloak.service';


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
    provideHttpClient(),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(), // Add this if it's not there already
    provideAnimationsAsync(),
    importProvidersFrom(DragDropModule),
    provideClientHydration(withEventReplay()),
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true
    }

]
};
