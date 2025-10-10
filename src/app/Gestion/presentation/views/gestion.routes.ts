import { Routes } from '@angular/router';

export const GESTION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./gestion-mascotas/gestion-mascotas-dashboard/gestion-mascotas-dashboard.component').then(m => m.GestionMascotasDashboardComponent)
  },
  {
    path: 'mascotas',
    loadComponent: () => import('./gestion-mascotas/mascota-list/mascota-list.component').then(m => m.MascotaListComponent)
  },
  {
    path: 'mascotas/nueva',
    loadComponent: () => import('./gestion-mascotas/mascota-form/mascota-form.component').then(m => m.MascotaFormComponent)
  },
  {
    path: 'mascotas/:id',
    loadComponent: () => import('./gestion-mascotas/mascota-detail/mascota-detail.component').then(m => m.MascotaDetailComponent)
  },
  {
    path: 'mascotas/:id/editar',
    loadComponent: () => import('./gestion-mascotas/mascota-form/mascota-form.component').then(m => m.MascotaFormComponent)
  }
];


