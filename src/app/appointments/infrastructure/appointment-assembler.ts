import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Appointment } from '../domain/model/appointment.entity';
import { AppointmentResource, AppointmentsResponse } from './appointments-response';

/**
 * Assembler for converting between Appointment entities and API resources
 */
export class AppointmentAssembler implements BaseAssembler<Appointment, AppointmentResource, AppointmentsResponse> {
  toEntityFromResource(resource: AppointmentResource): Appointment {
    return new Appointment({
      id: resource.id,
      mascotaId: resource.mascotaId,
      veterinaryId: resource.veterinaryId,
      fechaHora: resource.fechaHora,
      motivo: resource.motivo,
      estado: resource.estado,
      notas: resource.notas,
      veterinaryStatus: resource.veterinaryStatus
    });
  }

  toResourceFromEntity(entity: Appointment): AppointmentResource {
    return {
      id: entity.id,
      mascotaId: entity.mascotaId,
      veterinaryId: entity.veterinaryId,
      fechaHora: entity.fechaHora,
      motivo: entity.motivo,
      estado: entity.estado,
      notas: entity.notas,
      veterinaryStatus: entity.veterinaryStatus
    };
  }

  toEntitiesFromResponse(response: AppointmentsResponse): Appointment[] {
    // Backend returns array directly, not wrapped in { citas: [...] }
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
