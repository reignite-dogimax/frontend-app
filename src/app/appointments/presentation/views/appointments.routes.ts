import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from '../../../iam/infrastructure/auth-storage.service';

const appointmentList = () => import('./appointment-list/appointment-list.component').then(m => m.AppointmentListComponent);
const veterinaryAppointments = () => import('./veterinary-appointments/veterinary-appointments.component').then(m => m.VeterinaryAppointmentsComponent);
const dailyAgenda = () => import('./daily-agenda/daily-agenda.component').then(m => m.DailyAgendaComponent);
const appointmentForm = () => import('./appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent);
const patientHistory = () => import('./patient-history/patient-history.component').then(m => m.PatientHistoryComponent);
const myPetsHistory = () => import('./my-pets-history/my-pets-history.component').then(m => m.MyPetsHistoryComponent);

// Redirect based on user role
const roleBasedRedirect = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);
  const currentUser = authStorage.getUser();
  
  if (currentUser?.rol?.toLowerCase() === 'veterinary') {
    router.navigate(['/appointments/veterinary']);
  } else {
    router.navigate(['/appointments/pet-lover']);
  }
  
  return true;
};

export const appointmentsRoutes: Routes = [
  { 
    path: '', 
    canActivate: [roleBasedRedirect],
    children: []
  },
  { path: 'pet-lover', loadComponent: appointmentList },
  { path: 'pet-lover/new', loadComponent: appointmentForm },
  { path: 'pet-lover/:id/edit', loadComponent: appointmentForm },
  { path: 'pet-lover/my-pets-history', loadComponent: myPetsHistory },
  { path: 'veterinary', loadComponent: veterinaryAppointments },
  { path: 'veterinary/daily-agenda', loadComponent: dailyAgenda },
  { path: 'veterinary/patient-history', loadComponent: patientHistory },
  { path: 'veterinary/:id/complete', loadComponent: appointmentForm },
  { path: 'veterinary/followup', loadComponent: appointmentForm }
];
