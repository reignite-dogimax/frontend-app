import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Veterinary } from '../domain/model/veterinary.entity';
import { VeterinaryResource, VeterinariesResponse } from './veterinaries-response';

/**
 * Assembler for converting between Veterinary entities and API resources
 */
export class VeterinaryAssembler implements BaseAssembler<Veterinary, VeterinaryResource, VeterinariesResponse> {
  toEntityFromResource(resource: VeterinaryResource): Veterinary {
    return new Veterinary({
      id: resource.id,
      nombre: resource.nombre,
      direccion: resource.direccion,
      telefono: resource.telefono,
      servicios: resource.servicios,
      horario: resource.horario
    });
  }

  toResourceFromEntity(entity: Veterinary): VeterinaryResource {
    return {
      id: entity.id,
      nombre: entity.nombre,
      direccion: entity.direccion,
      telefono: entity.telefono,
      servicios: entity.servicios,
      horario: entity.horario
    };
  }

  toEntitiesFromResponse(response: VeterinariesResponse): Veterinary[] {
    // Backend returns array directly, not wrapped in { veterinarys: [...] }
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
