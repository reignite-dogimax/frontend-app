import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  HistorialMedico,
  Vacuna,
  CreateHistorialRequest,
  CreateVacunaRequest
} from '../../domain/models/historial-medico.model';
import { HistorialMedicoDto, VacunaDto } from '../../infrastructure/http/historial-medico.dto';
import { historialFromDto, vacunaFromDto, historialToDto, vacunaToDto } from '../../infrastructure/mappers/historial-medico.mapper';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private readonly baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  // Obtener historial médico de una mascota
  getHistorialByMascota(mascotaId: number): Observable<HistorialMedico[]> {
    return this.http
      .get<HistorialMedicoDto[]>(`${this.baseUrl}/historial-medico?mascotaId=${mascotaId}`)
      .pipe(map(dtos => dtos.map(historialFromDto)));
  }

  // Obtener un registro específico del historial
  getHistorialById(id: number): Observable<HistorialMedico> {
    return this.http
      .get<HistorialMedicoDto>(`${this.baseUrl}/historial-medico/${id}`)
      .pipe(map(historialFromDto));
  }

  // Crear un nuevo registro en el historial
  createHistorial(historial: CreateHistorialRequest): Observable<HistorialMedico> {
    const entity: Partial<HistorialMedico> = {
      mascotaId: historial.mascotaId,
      fechaRegistro: new Date(),
      tipoRegistro: historial.tipoRegistro,
      descripcion: historial.descripcion,
      veterinario: historial.veterinario,
      observaciones: historial.observaciones,
      archivos: historial.archivos,
      costo: historial.costo,
      proximaCita: historial.proximaCita,
    };
    const dto = historialToDto(entity) as Omit<HistorialMedicoDto, 'id'>;

    return this.http
      .post<HistorialMedicoDto>(`${this.baseUrl}/historial-medico`, dto)
      .pipe(map(historialFromDto));
  }

  // Actualizar un registro del historial
  updateHistorial(id: number, historial: Partial<HistorialMedico>): Observable<HistorialMedico> {
    const { id: _ignored, ...patch } = historialToDto(historial) as Partial<HistorialMedicoDto>;

    return this.http
      .patch<HistorialMedicoDto>(`${this.baseUrl}/historial-medico/${id}`, patch)
      .pipe(map(historialFromDto));
  }

  // Eliminar un registro del historial
  deleteHistorial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/historial-medico/${id}`);
  }

  // Obtener vacunas de una mascota
  getVacunasByMascota(mascotaId: number): Observable<Vacuna[]> {
    return this.http
      .get<VacunaDto[]>(`${this.baseUrl}/registrosVacunacion?mascotaId=${mascotaId}`)
      .pipe(map(dtos => dtos.map(vacunaFromDto)));
  }

  // Crear un nuevo registro de vacuna
  createVacuna(vacuna: CreateVacunaRequest): Observable<Vacuna> {
    const entity: Partial<Vacuna> = {
      mascotaId: vacuna.mascotaId,
      nombreVacuna: vacuna.nombreVacuna,
      fechaAplicacion: vacuna.fechaAplicacion,
      proximaAplicacion: vacuna.proximaAplicacion,
      lote: vacuna.lote,
      veterinario: vacuna.veterinario,
      observaciones: vacuna.observaciones,
    };
    const dto = vacunaToDto(entity) as Omit<VacunaDto, 'id'>;

    return this.http
      .post<VacunaDto>(`${this.baseUrl}/registrosVacunacion`, dto)
      .pipe(map(vacunaFromDto));
  }

  // Actualizar un registro de vacuna
  updateVacuna(id: number, vacuna: Partial<Vacuna>): Observable<Vacuna> {
    const { id: _ignored, ...patch } = vacunaToDto(vacuna) as Partial<VacunaDto>;

    return this.http
      .patch<VacunaDto>(`${this.baseUrl}/registrosVacunacion/${id}`, patch)
      .pipe(map(vacunaFromDto));
  }

  // Eliminar un registro de vacuna
  deleteVacuna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/registrosVacunacion/${id}`);
  }

  // Obtener próximas vacunas pendientes (<= ahora)
  getProximasVacunas(mascotaId: number): Observable<Vacuna[]> {
    const nowIso = new Date().toISOString();
    return this.http
      .get<VacunaDto[]>(`${this.baseUrl}/registrosVacunacion?mascotaId=${mascotaId}&proximaAplicacion_lte=${encodeURIComponent(nowIso)}`)
      .pipe(map(dtos => dtos.map(vacunaFromDto)));
  }

  // Obtener historial por tipo de registro
  getHistorialByTipo(mascotaId: number, tipo: string): Observable<HistorialMedico[]> {
    return this.http
      .get<HistorialMedicoDto[]>(`${this.baseUrl}/historial-medico?mascotaId=${mascotaId}&tipoRegistro=${encodeURIComponent(tipo)}`)
      .pipe(map(dtos => dtos.map(historialFromDto)));
  }
}




