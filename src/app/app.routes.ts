import { Routes } from '@angular/router';
import { NotificationsPageComponent } from './notifications/presentation/notifications-page/notifications-page.component';
import { LoginComponent } from './iam/presentation/login/login.component';
import { RegisterComponent } from './iam/presentation/register/register.component';
import { authGuard } from './iam/infrastructure/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'appointments', 
    loadChildren: () => import('./appointments/presentation/views/appointments.routes').then(m => m.appointmentsRoutes),
    canActivate: [authGuard]
  },
  { 
    path: 'notifications', 
    component: NotificationsPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'gestion-mascotas',
    loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/gestion-mascotas-navigation/gestion-mascotas-navigation.component').then(m => m.GestionMascotasNavigationComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/gestion-mascotas-dashboard/gestion-mascotas-dashboard.component').then(m => m.GestionMascotasDashboardComponent)
      },
      {
        path: 'test-routing',
        loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/routing-test/routing-test.component').then(m => m.RoutingTestComponent)
      },
      {
        path: 'mascotas',
        children: [
          {
            path: '',
            loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/mascota-list/mascota-list.component').then(m => m.MascotaListComponent)
          },
          {
            path: 'nueva',
            loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/mascota-form/mascota-form.component').then(m => m.MascotaFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/mascota-detail/mascota-detail.component').then(m => m.MascotaDetailComponent)
          },
          {
            path: ':id/editar',
            loadComponent: () => import('./Gestion/presentation/views/gestion-mascotas/mascota-form/mascota-form.component').then(m => m.MascotaFormComponent)
          }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'appointments' }
];
