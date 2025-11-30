import { BaseResource } from '../../shared/infrastructure/base-response';
import { VeterinaryStatus } from '../domain/model/appointment.entity';

/**
 * Appointment resource from backend API
 * Matches the structure of AppointmentResource.java
 */
export interface AppointmentResource extends BaseResource {
  id: number;
  mascotaId: number;
  veterinaryId: number; // ID del usuario veterinario
  fechaHora: string; // ISO 8601 format from LocalDateTime
  motivo: string;
  estado: string;
  notas: string;
  veterinaryStatus: VeterinaryStatus;
}

/**
 * Response wrapper for appointments list
 * Backend returns array directly, not wrapped
 */
export type AppointmentsResponse = AppointmentResource[];
