import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Pet resource/DTO for API communication.
 */
export interface PetResource extends BaseResource {
  id: number;
  userId: number;
  name: string;
  species: string;
  breed: string;
  birthDate?: string;
  weight?: number;
  color?: string;
  gender?: 'MALE' | 'FEMALE';
  isNeutered?: boolean;
  observations?: string;
  photo?: string;
  registrationDate: string;
  isActive: boolean;
}

/**
 * @deprecated Use PetResource instead
 */
export interface MascotaResource extends PetResource {}

/**
 * MedicalHistory resource/DTO for API communication.
 */
export interface MedicalHistoryResource extends BaseResource {
  id: number;
  petId: number;
  registrationDate: string;
  recordType: 'VACCINATION' | 'CONSULTATION' | 'SURGERY' | 'EXAM' | 'TREATMENT';
  description: string;
  veterinarian?: string;
  observations?: string;
  files?: string;
  cost?: number;
  nextAppointment?: string | null;
}

/**
 * @deprecated Use MedicalHistoryResource instead
 */
export interface HistorialMedicoResource extends MedicalHistoryResource {}

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
 * Recommendation resource/DTO for API communication.
 */
export interface RecommendationResource extends BaseResource {
  id: number;
  petId: number;
  type: 'NUTRITION' | 'EXERCISE' | 'HEALTH' | 'BEHAVIOR' | 'CARE' | 'VACCINATION';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  generationDate: string;
  expirationDate?: string;
  isCompleted: boolean;
  completionDate?: string;
  aiSource?: string;
  confidence?: number;
  parameters?: string;
}

/**
 * @deprecated Use RecommendationResource instead
 */
export interface RecomendacionResource extends RecommendationResource {}

/**
 * Response wrapper for Pet operations.
 */
export interface PetResponse {
  pet: PetResource;
}

/**
 * Response wrapper for Pet array operations.
 */
export interface PetsResponse {
  pets: PetResource[];
}

/**
 * @deprecated Use PetResponse instead
 */
export interface MascotaResponse extends PetResponse {}

/**
 * @deprecated Use PetsResponse instead
 */
export interface MascotasResponse {
  mascotas: PetResource[];
}

/**
 * Response wrapper for MedicalHistory operations.
 */
export interface MedicalHistoryResponse {
  medicalHistory: MedicalHistoryResource;
}

/**
 * Response wrapper for MedicalHistory array operations.
 */
export interface MedicalHistoriesResponse {
  medicalHistories: MedicalHistoryResource[];
}

/**
 * @deprecated Use MedicalHistoryResponse instead
 */
export interface HistorialMedicoResponse extends MedicalHistoryResponse {}

/**
 * @deprecated Use MedicalHistoriesResponse instead
 */
export interface HistorialesMedicosResponse {
  historialesMedicos: MedicalHistoryResource[];
}

/**
 * Response wrapper for Recommendation operations.
 */
export interface RecommendationResponse {
  recommendation: RecommendationResource;
}

/**
 * Response wrapper for Recommendation array operations.
 */
export interface RecommendationsResponse {
  recommendations: RecommendationResource[];
}

/**
 * @deprecated Use RecommendationResponse instead
 */
export interface RecomendacionResponse extends RecommendationResponse {}

/**
 * @deprecated Use RecommendationsResponse instead
 */
export interface RecomendacionesResponse {
  recomendaciones: RecommendationResource[];
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