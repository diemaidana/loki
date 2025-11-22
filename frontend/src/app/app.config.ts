import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

const LokiPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#efecff',
            100: '#dcd6ff',
            200: '#bcaeff',
            300: '#937aff',
            400: '#7244ff',
            500: '#5F2ECC',
            600: '#4f1db5',  
            700: '#431796',
            800: '#38167a',
            900: '#301363',
            950: '#1b083b'
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: LokiPreset,
        options: {
          prefix: 'p',
          darkModeSelector: false || 'none',
          cssLayer: false
        }
      }
    })
  ]
};
