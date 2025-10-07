export interface HistorialMedicoDto {
  id: number;
  mascotaId: number;
  fechaRegistro: string; // ISO string
  tipoRegistro: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento';
  descripcion: string;
  veterinario?: string;
  observaciones?: string;
  archivos?: string[];
  costo?: number;
  proximaCita?: string | null; // ISO string
}

export interface VacunaDto {
  id: number;
  mascotaId: number;
  nombreVacuna: string;
  fechaAplicacion: string; // ISO string
  proximaAplicacion?: string | null; // ISO string
  lote?: string;
  veterinario?: string;
  observaciones?: string;
}

