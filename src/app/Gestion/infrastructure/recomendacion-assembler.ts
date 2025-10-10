import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Recomendacion } from '../domain/model/recomendacion.entity';
import { RecomendacionResource, RecomendacionesResponse } from './gestion-response';

/**
 * Assembler for converting between Recomendacion entity and resources.
 */
export class RecomendacionAssembler implements BaseAssembler<Recomendacion, RecomendacionResource, RecomendacionesResponse> {
  
  /**
   * Converts a Recomendacion entity to a resource.
   * @param entity - The Recomendacion entity to convert.
   * @returns A resource representation of the Recomendacion.
   */
  toResourceFromEntity(entity: Recomendacion): RecomendacionResource {
    return {
      id: entity.id,
      mascotaId: entity.mascotaId,
      tipo: entity.tipo,
      titulo: entity.titulo,
      descripcion: entity.descripcion,
      prioridad: entity.prioridad,
      fechaGeneracion: entity.fechaGeneracion.toISOString(),
      fechaVencimiento: entity.fechaVencimiento?.toISOString(),
      completada: entity.completada,
      fuenteIA: entity.fuenteIA,
      confianza: entity.confianza,
      parametros: entity.parametros
    };
  }

  /**
   * Converts a resource to a Recomendacion entity.
   * @param resource - The resource to convert.
   * @returns A Recomendacion entity.
   */
  toEntityFromResource(resource: RecomendacionResource): Recomendacion {
    return new Recomendacion({
      id: resource.id,
      mascotaId: resource.mascotaId,
      tipo: resource.tipo,
      titulo: resource.titulo,
      descripcion: resource.descripcion,
      prioridad: resource.prioridad,
      fechaGeneracion: new Date(resource.fechaGeneracion),
      fechaVencimiento: resource.fechaVencimiento ? new Date(resource.fechaVencimiento) : undefined,
      completada: resource.completada,
      fuenteIA: resource.fuenteIA,
      confianza: resource.confianza,
      parametros: resource.parametros
    });
  }

  /**
   * Converts a response to an array of Recomendacion entities.
   * @param response - The response containing recomendaciones.
   * @returns Array of Recomendacion entities.
   */
  toEntitiesFromResponse(response: RecomendacionesResponse): Recomendacion[] {
    if (!response.recomendaciones) {
      return [];
    }
    return response.recomendaciones.map(resource => this.toEntityFromResource(resource));
  }
}