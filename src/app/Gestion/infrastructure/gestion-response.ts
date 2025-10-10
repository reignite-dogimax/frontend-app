import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Mascota resource/DTO for API communication.
 */
export interface MascotaResource extends BaseResource {
  id: number;
  usuarioId: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento?: string;
  peso?: number;
  color?: string;
  sexo?: 'Macho' | 'Hembra';
  esterilizado?: boolean;
  observaciones?: string;
  foto?: string;
  fechaRegistro: string;
  activo: boolean;
}

/**
 * HistorialMedico resource/DTO for API communication.
 */
export interface HistorialMedicoResource extends BaseResource {
  id: number;
  mascotaId: number;
  fechaRegistro: string;
  tipoRegistro: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento';
  descripcion: string;
  veterinario?: string;
  observaciones?: string;
  archivos?: string[];
  costo?: number;
  proximaCita?: string | null;
}

/**
 * Vacuna resource/DTO for API communication.
 */
export interface VacunaResource extends BaseResource {
  id: number;
  mascotaId: number;
  nombreVacuna: string;
  fechaAplicacion: string;
  proximaAplicacion?: string | null;
  lote?: string;
  veterinario?: string;
  observaciones?: string;
}

/**
 * Recomendacion resource/DTO for API communication.
 */
export interface RecomendacionResource extends BaseResource {
  id: number;
  mascotaId: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  fechaGeneracion: string;
  fechaVencimiento?: string;
  completada: boolean;
  fuenteIA?: string;
  confianza?: number;
  parametros?: any;
}

/**
 * Response wrapper for Mascota operations.
 */
export interface MascotaResponse {
  mascota: MascotaResource;
}

/**
 * Response wrapper for Mascota array operations.
 */
export interface MascotasResponse {
  mascotas: MascotaResource[];
}

/**
 * Response wrapper for HistorialMedico operations.
 */
export interface HistorialMedicoResponse {
  historialMedico: HistorialMedicoResource;
}

/**
 * Response wrapper for HistorialMedico array operations.
 */
export interface HistorialesMedicosResponse {
  historialesMedicos: HistorialMedicoResource[];
}

/**
 * Response wrapper for Vacuna operations.
 */
export interface VacunaResponse {
  vacuna: VacunaResource;
}

/**
 * Response wrapper for Vacuna array operations.
 */
export interface VacunasResponse {
  vacunas: VacunaResource[];
}

/**
 * Response wrapper for Recomendacion operations.
 */
export interface RecomendacionResponse {
  recomendacion: RecomendacionResource;
}

/**
 * Response wrapper for Recomendacion array operations.
 */
export interface RecomendacionesResponse {
  recomendaciones: RecomendacionResource[];
}