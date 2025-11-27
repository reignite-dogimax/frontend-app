import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { MedicalHistory } from '../domain/model/medical-history.entity';
import { MedicalHistoryResource, MedicalHistoriesResponse, HistorialesMedicosResponse } from './gestion-response';

/**
 * Assembler for converting between MedicalHistory entity and resources.
 */
export class HistorialMedicoAssembler implements BaseAssembler<MedicalHistory, MedicalHistoryResource, MedicalHistoriesResponse> {
  
  /**
   * Converts a MedicalHistory entity to a resource.
   * @param entity - The MedicalHistory entity to convert.
   * @returns A resource representation of the MedicalHistory.
   */
  toResourceFromEntity(entity: MedicalHistory): MedicalHistoryResource {
    return {
      id: entity.id,
      petId: entity.petId,
      registrationDate: entity.registrationDate.toISOString(),
      recordType: entity.recordType,
      description: entity.description,
      veterinarian: entity.veterinarian,
      observations: entity.observations,
      files: entity.files,
      cost: entity.cost,
      nextAppointment: entity.nextAppointment?.toISOString() || null
    };
  }

  /**
   * Converts a resource to a MedicalHistory entity.
   * @param resource - The resource to convert.
   * @returns A MedicalHistory entity.
   */
  toEntityFromResource(resource: MedicalHistoryResource): MedicalHistory {
    return new MedicalHistory({
      id: resource.id,
      petId: resource.petId,
      registrationDate: new Date(resource.registrationDate),
      recordType: resource.recordType,
      description: resource.description,
      veterinarian: resource.veterinarian,
      observations: resource.observations,
      files: resource.files,
      cost: resource.cost,
      nextAppointment: resource.nextAppointment ? new Date(resource.nextAppointment) : undefined
    });
  }

  /**
   * Converts a response to an array of MedicalHistory entities.
   * @param response - The response containing medical histories.
   * @returns Array of MedicalHistory entities.
   */
  toEntitiesFromResponse(response: MedicalHistoriesResponse | HistorialesMedicosResponse): MedicalHistory[] {
    const histories = 'medicalHistories' in response ? response.medicalHistories : response.historialesMedicos;
    if (!histories) {
      return [];
    }
    return histories.map((resource: MedicalHistoryResource) => this.toEntityFromResource(resource));
  }
}