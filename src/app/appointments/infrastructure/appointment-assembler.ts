import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Appointment } from '../domain/model/appointment.entity';
import { AppointmentResource, AppointmentsResponse } from './appointments-response';

export class AppointmentAssembler implements BaseAssembler<Appointment, AppointmentResource, AppointmentsResponse> {
  toEntityFromResource(resource: AppointmentResource): Appointment {
    return new Appointment({
      id: resource.id,
      mascotaId: resource.mascotaId,
      veterinariaId: resource.veterinariaId,
      fechaHora: resource.fechaHora,
      motivo: resource.motivo,
      estado: resource.estado,
      notas: resource.notas
    });
  }

  toResourceFromEntity(entity: Appointment): AppointmentResource {
    return {
      id: entity.id,
      mascotaId: entity.mascotaId,
      veterinariaId: entity.veterinariaId,
      fechaHora: entity.fechaHora,
      motivo: entity.motivo,
      estado: entity.estado,
      notas: entity.notas
    };
  }

  toEntitiesFromResponse(response: AppointmentsResponse): Appointment[] {
    return response.citas.map(resource => this.toEntityFromResource(resource));
  }
}
