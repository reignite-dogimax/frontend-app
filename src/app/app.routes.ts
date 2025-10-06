import { Routes } from '@angular/router';
import { NotificationsPageComponent } from './notifications/presentation/notifications-page/notifications-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notifications' },
  { path: 'notifications', component: NotificationsPageComponent }
];
