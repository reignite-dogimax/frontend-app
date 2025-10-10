import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Mascota } from '../domain/model/mascota.entity';
import { MascotaResource, MascotasResponse } from './gestion-response';

/**
 * Assembler for converting between Mascota entity and resources.
 */
export class MascotaAssembler implements BaseAssembler<Mascota, MascotaResource, MascotasResponse> {
  
  /**
   * Converts a Mascota entity to a resource.
   * @param entity - The Mascota entity to convert.
   * @returns A resource representation of the Mascota.
   */
  toResourceFromEntity(entity: Mascota): MascotaResource {
    return {
      id: entity.id,
      usuarioId: entity.usuarioId,
      nombre: entity.nombre,
      especie: entity.especie,
      raza: entity.raza,
      fechaNacimiento: entity.fechaNacimiento,
      peso: entity.peso,
      color: entity.color,
      sexo: entity.sexo,
      esterilizado: entity.esterilizado,
      observaciones: entity.observaciones,
      foto: entity.foto,
      fechaRegistro: entity.fechaRegistro,
      activo: entity.activo
    };
  }

  /**
   * Converts a resource to a Mascota entity.
   * @param resource - The resource to convert.
   * @returns A Mascota entity.
   */
  toEntityFromResource(resource: MascotaResource): Mascota {
    return new Mascota({
      id: resource.id,
      usuarioId: resource.usuarioId,
      nombre: resource.nombre,
      especie: resource.especie,
      raza: resource.raza,
      fechaNacimiento: resource.fechaNacimiento,
      peso: resource.peso,
      color: resource.color,
      sexo: resource.sexo,
      esterilizado: resource.esterilizado,
      observaciones: resource.observaciones,
      foto: resource.foto,
      fechaRegistro: resource.fechaRegistro,
      activo: resource.activo
    });
  }

  /**
   * Converts a response to an array of Mascota entities.
   * @param response - The response containing mascotas.
   * @returns Array of Mascota entities.
   */
  toEntitiesFromResponse(response: MascotasResponse): Mascota[] {
    if (!response.mascotas) {
      return [];
    }
    return response.mascotas.map(resource => this.toEntityFromResource(resource));
  }
}