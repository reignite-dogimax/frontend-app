import { computed, Injectable, Signal, signal } from '@angular/core';
import { Appointment } from '../domain/model/appointment.entity';
import { Veterinary } from '../domain/model/veterinary.entity';
import { AppointmentsApi } from '../infrastructure/appointments-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { AuthStorageService } from '../../iam/infrastructure/auth-storage.service';

/**
 * State management store for appointments and veterinaries using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class AppointmentsStore {
  readonly appointmentCount = computed(() => this.appointments().length);
  readonly veterinaryCount = computed(() => this.veterinaries().length);
  
  private readonly appointmentsSignal = signal<Appointment[]>([]);
  readonly appointments = this.appointmentsSignal.asReadonly();
  
  private readonly veterinariesSignal = signal<Veterinary[]>([]);
  readonly veterinaries = this.veterinariesSignal.asReadonly();
  
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private appointmentsApi: AppointmentsApi,
              private authStorage: AuthStorageService) {
    this.loadVeterinaries();
    this.loadAppointments();
  }

  /**
   * Retrieves a veterinary by its ID as a signal.
   * @param id - The ID of the veterinary.
   * @returns A Signal containing the Veterinary object or undefined if not found.
   */
  getVeterinaryById(id: number): Signal<Veterinary | undefined> {
    return computed(() => id ? this.veterinaries().find(v => v.id === id) : undefined);
  }

  /**
   * Retrieves an appointment by its ID as a signal.
   * @param id - The ID of the appointment.
   * @returns A Signal containing the Appointment object or undefined if not found.
   */
  getAppointmentById(id: number): Signal<Appointment | undefined> {
    return computed(() => id ? this.appointments().find(a => a.id === id) : undefined);
  }

  /**
   * Adds a new appointment.
   * @param appointment - The appointment to add.
   */
  addAppointment(appointment: Appointment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.createAppointment(appointment).pipe(retry(2)).subscribe({
      next: createdAppointment => {
        createdAppointment = this.assignVeterinaryToAppointment(createdAppointment);
        this.appointmentsSignal.update(appointments => [...appointments, createdAppointment]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing appointment.
   * @param updatedAppointment - The appointment to update.
   */
  updateAppointment(updatedAppointment: Appointment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.updateAppointment(updatedAppointment).pipe(retry(2)).subscribe({
      next: appointment => {
        appointment = this.assignVeterinaryToAppointment(appointment);
        this.appointmentsSignal.update(appointments =>
          appointments.map(a => a.id === appointment.id ? appointment : a)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes an appointment by ID.
   * @param id - The ID of the appointment to delete.
   */
  deleteAppointment(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.deleteAppointment(id).pipe(retry(2)).subscribe({
      next: () => {
        this.appointmentsSignal.update(appointments => appointments.filter(a => a.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds a new veterinary.
   * @param veterinary - The veterinary to add.
   */
  addVeterinary(veterinary: Veterinary): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.createVeterinary(veterinary).pipe(retry(2)).subscribe({
      next: createdVeterinary => {
        this.veterinariesSignal.update(veterinaries => [...veterinaries, createdVeterinary]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create veterinary'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing veterinary.
   * @param updatedVeterinary - The veterinary to update.
   */
  updateVeterinary(updatedVeterinary: Veterinary): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.updateVeterinary(updatedVeterinary).pipe(retry(2)).subscribe({
      next: veterinary => {
        this.veterinariesSignal.update(veterinaries =>
          veterinaries.map(v => v.id === veterinary.id ? veterinary : v)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update veterinary'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a veterinary by ID.
   * @param id - The ID of the veterinary to delete.
   */
  deleteVeterinary(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.deleteVeterinary(id).pipe(retry(2)).subscribe({
      next: () => {
        this.veterinariesSignal.update(veterinaries => veterinaries.filter(v => v.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete veterinary'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all appointments from the API.
   * If user is pet lover, loads only their appointments.
   * If user is veterinary, loads all appointments.
   */
  loadAppointments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    const user = this.authStorage.getUser();
    const observable = user && user.rol === 'petlover' && user.id
      ? this.appointmentsApi.getAppointmentsByPetOwnerId(user.id)
      : this.appointmentsApi.getAppointments();
    
    const subscription = observable.subscribe({
      next: appointments => {
        this.appointmentsSignal.set(appointments);
        this.loadingSignal.set(false);
        this.assignVeterinariesToAppointments();
        subscription.unsubscribe();
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load appointments'));
        this.loadingSignal.set(false);
        subscription.unsubscribe();
      }
    });
  }

  /**
   * Loads all veterinaries from the API.
   */
  private loadVeterinaries(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const subscription = this.appointmentsApi.getVeterinaries().subscribe({
      next: veterinaries => {
        this.veterinariesSignal.set(veterinaries);
        this.loadingSignal.set(false);
        subscription.unsubscribe();
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load veterinaries'));
        this.loadingSignal.set(false);
        subscription.unsubscribe();
      }
    });
  }

  private assignVeterinariesToAppointments(): void {
    this.appointmentsSignal.update(appointments => 
      appointments.map(appointment => this.assignVeterinaryToAppointment(appointment))
    );
  }

  private assignVeterinaryToAppointment(appointment: Appointment): Appointment {
    const veterinaryId = appointment.veterinaryId ?? 0;
    appointment.veterinary = veterinaryId ? this.getVeterinaryById(veterinaryId)() ?? null : null;
    return appointment;
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
