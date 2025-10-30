import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Veterinary resource from backend API
 * Matches the structure of VeterinaryResource.java
 */
export interface VeterinaryResource extends BaseResource {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  servicios: string[];
  horario: string;
}

/**
 * Response wrapper for veterinaries list
 * Backend returns array directly, not wrapped
 */
export type VeterinariesResponse = VeterinaryResource[];
