import { BaseResource } from '../../shared/infrastructure/base-response';

export interface AppointmentResource extends BaseResource {
  id: number;
  mascotaId: number;
  veterinariaId: number;
  fechaHora: string;
  motivo: string;
  estado: string;
  notas: string;
}

export interface AppointmentsResponse {
  citas: AppointmentResource[];
}
