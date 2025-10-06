import { Routes } from '@angular/router';
<<<<<<< HEAD

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/gestion-mascotas',
    pathMatch: 'full'
  },
  {
    path: 'gestion-mascotas',
    loadComponent: () => import('./shared/presentation/components/gestion-mascotas/gestion-mascotas-navigation/gestion-mascotas-navigation.component').then(m => m.GestionMascotasNavigationComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./shared/presentation/components/gestion-mascotas/gestion-mascotas-dashboard/gestion-mascotas-dashboard.component').then(m => m.GestionMascotasDashboardComponent)
      },
      {
        path: 'test-routing',
        loadComponent: () => import('./shared/presentation/components/gestion-mascotas/routing-test/routing-test.component').then(m => m.RoutingTestComponent)
      },
      {
        path: 'mascotas',
        children: [
          {
            path: '',
            loadComponent: () => import('./shared/presentation/components/gestion-mascotas/mascota-list/mascota-list.component').then(m => m.MascotaListComponent)
          },
          {
            path: 'nueva',
            loadComponent: () => import('./shared/presentation/components/gestion-mascotas/mascota-form/mascota-form.component').then(m => m.MascotaFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./shared/presentation/components/gestion-mascotas/mascota-detail/mascota-detail.component').then(m => m.MascotaDetailComponent)
          },
          {
            path: ':id/editar',
            loadComponent: () => import('./shared/presentation/components/gestion-mascotas/mascota-form/mascota-form.component').then(m => m.MascotaFormComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/gestion-mascotas'
  }
=======
import { NotificationsPageComponent } from './notifications/presentation/notifications-page/notifications-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notifications' },
  { path: 'notifications', component: NotificationsPageComponent }
>>>>>>> refs/heads/feature/gestión_de_notificaciones
];
