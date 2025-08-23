// Importació explícita de zone.js per evitar problemes amb Vite
import 'zone.js';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
// Note: We'll use the Firebase SDK directly in our service instead of @angular/fire

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons(allIcons);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    // Firebase will be initialized in the FirebaseStorageService
  ],
});
