import { HistorialMedico, Vacuna } from '../../domain/models/historial-medico.model';
import { HistorialMedicoDto, VacunaDto } from '../http/historial-medico.dto';

export function historialFromDto(dto: HistorialMedicoDto): HistorialMedico {
  return {
    id: dto.id,
    mascotaId: dto.mascotaId,
    fechaRegistro: new Date(dto.fechaRegistro),
    tipoRegistro: dto.tipoRegistro,
    descripcion: dto.descripcion,
    veterinario: dto.veterinario,
    observaciones: dto.observaciones,
    archivos: dto.archivos,
    costo: dto.costo,
    proximaCita: dto.proximaCita ? new Date(dto.proximaCita) : undefined,
  };
}

export function historialToDto(entity: Partial<HistorialMedico>): Partial<HistorialMedicoDto> {
  return {
    id: entity.id as any, // id normalmente lo pone el backend
    mascotaId: entity.mascotaId!,
    fechaRegistro: entity.fechaRegistro ? entity.fechaRegistro.toISOString() : undefined as any,
    tipoRegistro: entity.tipoRegistro!,
    descripcion: entity.descripcion!,
    veterinario: entity.veterinario,
    observaciones: entity.observaciones,
    archivos: entity.archivos,
    costo: entity.costo,
    proximaCita: entity.proximaCita ? entity.proximaCita.toISOString() : undefined,
  } as Partial<HistorialMedicoDto>;
}

export function vacunaFromDto(dto: VacunaDto): Vacuna {
  return {
    id: dto.id,
    mascotaId: dto.mascotaId,
    nombreVacuna: dto.nombreVacuna,
    fechaAplicacion: new Date(dto.fechaAplicacion),
    proximaAplicacion: dto.proximaAplicacion ? new Date(dto.proximaAplicacion) : undefined,
    lote: dto.lote,
    veterinario: dto.veterinario,
    observaciones: dto.observaciones,
  };
}

export function vacunaToDto(entity: Partial<Vacuna>): Partial<VacunaDto> {
  return {
    id: entity.id as any,
    mascotaId: entity.mascotaId!,
    nombreVacuna: entity.nombreVacuna!,
    fechaAplicacion: entity.fechaAplicacion ? entity.fechaAplicacion.toISOString() : undefined as any,
    proximaAplicacion: entity.proximaAplicacion ? entity.proximaAplicacion.toISOString() : undefined,
    lote: entity.lote,
    veterinario: entity.veterinario,
    observaciones: entity.observaciones,
  } as Partial<VacunaDto>;
}

