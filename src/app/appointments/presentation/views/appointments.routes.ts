import { Routes } from '@angular/router';

const appointmentList = () => import('./appointment-list/appointment-list.component').then(m => m.AppointmentListComponent);
const appointmentForm = () => import('./appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent);

export const appointmentsRoutes: Routes = [
  { path: '', loadComponent: appointmentList },
  { path: 'new', loadComponent: appointmentForm },
  { path: ':id/edit', loadComponent: appointmentForm }
];
