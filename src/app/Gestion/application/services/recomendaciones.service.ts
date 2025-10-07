import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Recomendacion, 
  CreateRecomendacionRequest, 
  IARequest, 
  IAResponse 
} from '../../domain/models/recomendacion.model';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private readonly baseUrl = 'http://localhost:3000';
  private readonly aiServiceUrl = 'http://localhost:3001'; // Simulando servicio de IA

  constructor(private http: HttpClient) {}

  // Obtener recomendaciones de una mascota
  getRecomendacionesByMascota(mascotaId: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}`);
  }

  // Obtener una recomendación específica
  getRecomendacionById(id: number): Observable<Recomendacion> {
    return this.http.get<Recomendacion>(`${this.baseUrl}/recomendaciones/${id}`);
  }

  // Crear una nueva recomendación
  createRecomendacion(recomendacion: CreateRecomendacionRequest): Observable<Recomendacion> {
    const recomendacionData = {
      ...recomendacion,
      fechaGeneracion: new Date().toISOString(),
      completada: false
    };
    return this.http.post<Recomendacion>(`${this.baseUrl}/recomendaciones`, recomendacionData);
  }

  // Actualizar una recomendación
  updateRecomendacion(id: number, recomendacion: Partial<Recomendacion>): Observable<Recomendacion> {
    return this.http.patch<Recomendacion>(`${this.baseUrl}/recomendaciones/${id}`, recomendacion);
  }

  // Marcar recomendación como completada
  marcarCompletada(id: number): Observable<Recomendacion> {
    return this.http.patch<Recomendacion>(`${this.baseUrl}/recomendaciones/${id}`, {
      completada: true,
      fechaCompletada: new Date().toISOString()
    });
  }

  // Eliminar una recomendación
  deleteRecomendacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/recomendaciones/${id}`);
  }

  // Obtener recomendaciones por tipo
  getRecomendacionesByTipo(mascotaId: number, tipo: string): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}&tipo=${tipo}`);
  }

  // Obtener recomendaciones por prioridad
  getRecomendacionesByPrioridad(mascotaId: number, prioridad: string): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}&prioridad=${prioridad}`);
  }

  // Generar recomendaciones usando IA
  generarRecomendacionesIA(request: IARequest): Observable<IAResponse> {
    return this.http.post<IAResponse>(`${this.aiServiceUrl}/recomendaciones/generar`, request);
  }

  // Obtener recomendaciones pendientes
  getRecomendacionesPendientes(mascotaId: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}&completada=false`);
  }

  // Obtener recomendaciones vencidas
  getRecomendacionesVencidas(mascotaId: number): Observable<Recomendacion[]> {
    const hoy = new Date().toISOString();
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}&fechaVencimiento_lte=${hoy}&completada=false`);
  }

  // Obtener estadísticas de recomendaciones
  getEstadisticasRecomendaciones(mascotaId: number): Observable<{
    total: number;
    completadas: number;
    pendientes: number;
    vencidas: number;
    porTipo: Record<string, number>;
    porPrioridad: Record<string, number>;
  }> {
    return this.http.get<any>(`${this.baseUrl}/recomendaciones/estadisticas?mascotaId=${mascotaId}`);
  }
}


