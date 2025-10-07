export interface Mascota {
  id: number;
  usuarioId: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento?: string; // ISO string
  peso?: number;
  color?: string;
  sexo?: 'Macho' | 'Hembra';
  esterilizado?: boolean;
  observaciones?: string;
  foto?: string;
  fechaRegistro: string; // ISO string
  activo: boolean;
}

export interface CreateMascotaRequest {
  usuarioId: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento?: string; // ISO string
  peso?: number;
  color?: string;
  sexo?: 'Macho' | 'Hembra';
  esterilizado?: boolean;
  observaciones?: string;
  foto?: string;
}

export interface UpdateMascotaRequest {
  nombre?: string;
  especie?: string;
  raza?: string;
  fechaNacimiento?: string; // ISO string
  peso?: number;
  color?: string;
  sexo?: 'Macho' | 'Hembra';
  esterilizado?: boolean;
  observaciones?: string;
  foto?: string;
}
