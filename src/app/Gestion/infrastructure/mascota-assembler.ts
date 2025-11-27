import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Pet } from '../domain/model/pet.entity';
import { PetResource, PetsResponse, MascotasResponse } from './gestion-response';

/**
 * Assembler for converting between Pet entity and resources.
 */
export class MascotaAssembler implements BaseAssembler<Pet, PetResource, PetsResponse> {
  
  /**
   * Converts a Pet entity to a resource.
   * @param entity - The Pet entity to convert.
   * @returns A resource representation of the Pet.
   */
  toResourceFromEntity(entity: Pet): PetResource {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      species: entity.species,
      breed: entity.breed,
      birthDate: entity.birthDate,
      weight: entity.weight,
      color: entity.color,
      gender: entity.gender,
      isNeutered: entity.isNeutered,
      observations: entity.observations,
      photo: entity.photo,
      registrationDate: entity.registrationDate,
      isActive: entity.isActive
    };
  }

  /**
   * Converts a resource to a Pet entity.
   * @param resource - The resource to convert.
   * @returns A Pet entity.
   */
  toEntityFromResource(resource: PetResource): Pet {
    return new Pet({
      id: resource.id,
      userId: resource.userId,
      name: resource.name,
      species: resource.species,
      breed: resource.breed,
      birthDate: resource.birthDate,
      weight: resource.weight,
      color: resource.color,
      gender: resource.gender,
      isNeutered: resource.isNeutered,
      observations: resource.observations,
      photo: resource.photo,
      registrationDate: resource.registrationDate,
      isActive: resource.isActive
    });
  }

  /**
   * Converts a response to an array of Pet entities.
   * @param response - The response containing pets.
   * @returns Array of Pet entities.
   */
  toEntitiesFromResponse(response: PetsResponse | MascotasResponse): Pet[] {
    const pets = 'pets' in response ? response.pets : response.mascotas;
    if (!pets) {
      return [];
    }
    return pets.map(resource => this.toEntityFromResource(resource));
  }
}