import { BaseResource } from '../../shared/infrastructure/base-response';

export interface VeterinaryResource extends BaseResource {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  servicios: string[];
  horario: string;
}

export interface VeterinariesResponse {
  veterinarias: VeterinaryResource[];
}
