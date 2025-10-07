export interface HistorialMedico {
  id: number;
  mascotaId: number;
  fechaRegistro: Date;
  tipoRegistro: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento';
  descripcion: string;
  veterinario?: string;
  observaciones?: string;
  archivos?: string[];
  costo?: number;
  proximaCita?: Date;
}

export interface Vacuna {
  id: number;
  mascotaId: number;
  nombreVacuna: string;
  fechaAplicacion: Date;
  proximaAplicacion?: Date;
  lote?: string;
  veterinario?: string;
  observaciones?: string;
}

export interface CreateHistorialRequest {
  mascotaId: number;
  tipoRegistro: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento';
  descripcion: string;
  veterinario?: string;
  observaciones?: string;
  archivos?: string[];
  costo?: number;
  proximaCita?: Date;
}

export interface CreateVacunaRequest {
  mascotaId: number;
  nombreVacuna: string;
  fechaAplicacion: Date;
  proximaAplicacion?: Date;
  lote?: string;
  veterinario?: string;
  observaciones?: string;
}




