import { ApplicationConfig, provideZoneChangeDetection,  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideHttpClient, withFetch} from '@angular/common/http';
import { NOTIFICATION_REPOSITORY } from './notifications/domain/notification.repository';
import { HttpNotificationRepository } from './notifications/infrastructure/http/http-notification.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en'
    }),
    provideHttpClient(withFetch()),
    { provide: NOTIFICATION_REPOSITORY, useClass: HttpNotificationRepository }
  ]
};
