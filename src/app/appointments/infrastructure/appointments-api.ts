import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Appointment } from '../domain/model/appointment.entity';
import { Veterinary } from '../domain/model/veterinary.entity';
import { HttpClient } from '@angular/common/http';
import { AppointmentsApiEndpoint } from './appointments-api-endpoint';
import { VeterinariesApiEndpoint } from './veterinaries-api-endpoint';
import { Observable } from 'rxjs';

/**
 * API service for managing endpoints in the appointments context.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentsApi extends BaseApi {
  private readonly appointmentsEndpoint: AppointmentsApiEndpoint;
  private readonly veterinariesEndpoint: VeterinariesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.appointmentsEndpoint = new AppointmentsApiEndpoint(http);
    this.veterinariesEndpoint = new VeterinariesApiEndpoint(http);
  }

  // Appointments CRUD
  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsEndpoint.getAll();
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.appointmentsEndpoint.getById(id);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentsEndpoint.create(appointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentsEndpoint.update(appointment, appointment.id);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.appointmentsEndpoint.delete(id);
  }

  // Veterinaries CRUD
  getVeterinaries(): Observable<Veterinary[]> {
    return this.veterinariesEndpoint.getAll();
  }

  getVeterinary(id: number): Observable<Veterinary> {
    return this.veterinariesEndpoint.getById(id);
  }

  createVeterinary(veterinary: Veterinary): Observable<Veterinary> {
    return this.veterinariesEndpoint.create(veterinary);
  }

  updateVeterinary(veterinary: Veterinary): Observable<Veterinary> {
    return this.veterinariesEndpoint.update(veterinary, veterinary.id);
  }

  deleteVeterinary(id: number): Observable<void> {
    return this.veterinariesEndpoint.delete(id);
  }
}
