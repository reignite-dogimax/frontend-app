import { ApplicationConfig, provideZoneChangeDetection,  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { NOTIFICATION_REPOSITORY } from './notifications/domain/notification.repository';
import { NotificationsApiRepository } from './notifications/infrastructure/notifications-api.repository';
import { authInterceptor } from './iam/infrastructure/auth.interceptor.fn';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimationsAsync(),

    { provide: NOTIFICATION_REPOSITORY, useClass: NotificationsApiRepository }

  ]
};
