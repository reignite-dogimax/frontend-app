import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { HistorialMedico } from '../domain/model/historial-medico.entity';
import { HistorialMedicoResource, HistorialesMedicosResponse } from './gestion-response';

/**
 * Assembler for converting between HistorialMedico entity and resources.
 */
export class HistorialMedicoAssembler implements BaseAssembler<HistorialMedico, HistorialMedicoResource, HistorialesMedicosResponse> {
  
  /**
   * Converts a HistorialMedico entity to a resource.
   * @param entity - The HistorialMedico entity to convert.
   * @returns A resource representation of the HistorialMedico.
   */
  toResourceFromEntity(entity: HistorialMedico): HistorialMedicoResource {
    return {
      id: entity.id,
      mascotaId: entity.mascotaId,
      fechaRegistro: entity.fechaRegistro.toISOString(),
      tipoRegistro: entity.tipoRegistro,
      descripcion: entity.descripcion,
      veterinario: entity.veterinario,
      observaciones: entity.observaciones,
      archivos: entity.archivos,
      costo: entity.costo,
      proximaCita: entity.proximaCita?.toISOString() || null
    };
  }

  /**
   * Converts a resource to a HistorialMedico entity.
   * @param resource - The resource to convert.
   * @returns A HistorialMedico entity.
   */
  toEntityFromResource(resource: HistorialMedicoResource): HistorialMedico {
    return new HistorialMedico({
      id: resource.id,
      mascotaId: resource.mascotaId,
      fechaRegistro: new Date(resource.fechaRegistro),
      tipoRegistro: resource.tipoRegistro,
      descripcion: resource.descripcion,
      veterinario: resource.veterinario,
      observaciones: resource.observaciones,
      archivos: resource.archivos,
      costo: resource.costo,
      proximaCita: resource.proximaCita ? new Date(resource.proximaCita) : undefined
    });
  }

  /**
   * Converts a response to an array of HistorialMedico entities.
   * @param response - The response containing historiales.
   * @returns Array of HistorialMedico entities.
   */
  toEntitiesFromResponse(response: HistorialesMedicosResponse): HistorialMedico[] {
    if (!response.historialesMedicos) {
      return [];
    }
    return response.historialesMedicos.map(resource => this.toEntityFromResource(resource));
  }
}