export interface Recomendacion {
  id: number;
  mascotaId: number;
  tipo: 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento' | 'Cuidados' | 'Vacunacion';
  titulo: string;
  descripcion: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
  fechaGeneracion: Date;
  fechaVencimiento?: Date;
  completada: boolean;
  fechaCompletada?: Date;
  fuenteIA: string;
  confianza: number; // 0-100
  parametros?: Record<string, any>;
}

export interface CreateRecomendacionRequest {
  mascotaId: number;
  tipo: 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento' | 'Cuidados' | 'Vacunacion';
  titulo: string;
  descripcion: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
  fechaVencimiento?: Date;
  fuenteIA: string;
  confianza: number;
  parametros?: Record<string, any>;
}

export interface IARequest {
  mascotaId: number;
  tipoAnalisis: 'General' | 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento';
  datosMascota: {
    edad: number;
    peso: number;
    especie: string;
    raza: string;
    historialMedico: any[];
    ultimasVacunas: any[];
  };
  contexto?: string;
}

export interface IAResponse {
  recomendaciones: Recomendacion[];
  resumen: string;
  confianza: number;
  fechaGeneracion: Date;
}




