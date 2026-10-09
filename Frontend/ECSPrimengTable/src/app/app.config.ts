import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { Preset } from './themes/preset';
import { MessageService } from 'primeng/api';
import { SharedService } from './core/services/shared.service';
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from 'ecs-primeng-table';
import { NotificationService } from './core/services/notification.service';
import { HttpService } from './core/services/http.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { spinnerInterceptor } from './core/interceptors/spinner.interceptor'; // Importa la versión funcional

import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
        license: 'PRIMEUI-LICENSE-KEY',
        theme: {
          preset: Preset,
          options: {
            darkModeSelector: 'none'
          }
        },
        ripple: true
      }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([spinnerInterceptor])
    ),
    MessageService,
    SharedService,
    DatePipe,
    { provide: ECSPrimengTableNotificationService, useClass: NotificationService },
    { provide: ECSPrimengTableHttpService, useClass: HttpService },
  ]
};