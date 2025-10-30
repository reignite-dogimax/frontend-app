import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Appointment resource from backend API
 * Matches the structure of AppointmentResource.java
 */
export interface AppointmentResource extends BaseResource {
  id: number;
  mascotaId: number;
  veterinaryId: number;
  fechaHora: string; // ISO 8601 format from LocalDateTime
  motivo: string;
  estado: string;
  notas: string;
}

/**
 * Response wrapper for appointments list
 * Backend returns array directly, not wrapped
 */
export type AppointmentsResponse = AppointmentResource[];
