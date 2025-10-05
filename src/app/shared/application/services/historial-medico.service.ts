import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  HistorialMedico, 
  Vacuna, 
  CreateHistorialRequest, 
  CreateVacunaRequest 
} from '../../domain/models/historial-medico.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener historial médico de una mascota
  getHistorialByMascota(mascotaId: number): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(`${this.baseUrl}/historial-medico?mascotaId=${mascotaId}`);
  }

  // Obtener un registro específico del historial
  getHistorialById(id: number): Observable<HistorialMedico> {
    return this.http.get<HistorialMedico>(`${this.baseUrl}/historial-medico/${id}`);
  }

  // Crear un nuevo registro en el historial
  createHistorial(historial: CreateHistorialRequest): Observable<HistorialMedico> {
    const historialData = {
      ...historial,
      fechaRegistro: new Date().toISOString()
    };
    return this.http.post<HistorialMedico>(`${this.baseUrl}/historial-medico`, historialData);
  }

  // Actualizar un registro del historial
  updateHistorial(id: number, historial: Partial<HistorialMedico>): Observable<HistorialMedico> {
    return this.http.patch<HistorialMedico>(`${this.baseUrl}/historial-medico/${id}`, historial);
  }

  // Eliminar un registro del historial
  deleteHistorial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/historial-medico/${id}`);
  }

  // Obtener vacunas de una mascota
  getVacunasByMascota(mascotaId: number): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.baseUrl}/registrosVacunacion?mascotaId=${mascotaId}`);
  }

  // Crear un nuevo registro de vacuna
  createVacuna(vacuna: CreateVacunaRequest): Observable<Vacuna> {
    return this.http.post<Vacuna>(`${this.baseUrl}/registrosVacunacion`, vacuna);
  }

  // Actualizar un registro de vacuna
  updateVacuna(id: number, vacuna: Partial<Vacuna>): Observable<Vacuna> {
    return this.http.patch<Vacuna>(`${this.baseUrl}/registrosVacunacion/${id}`, vacuna);
  }

  // Eliminar un registro de vacuna
  deleteVacuna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/registrosVacunacion/${id}`);
  }

  // Obtener próximas vacunas pendientes
  getProximasVacunas(mascotaId: number): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.baseUrl}/registrosVacunacion?mascotaId=${mascotaId}&proximaAplicacion_lte=${new Date().toISOString()}`);
  }

  // Obtener historial por tipo de registro
  getHistorialByTipo(mascotaId: number, tipo: string): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(`${this.baseUrl}/historial-medico?mascotaId=${mascotaId}&tipoRegistro=${tipo}`);
  }
}
