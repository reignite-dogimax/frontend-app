import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  // Usar el proxy para no acoplar a puertos locales
  private readonly baseUrl = '/api/v1';
  private readonly aiServiceUrl = '/api/v1'; // Simulación de servicio de IA bajo json-server

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
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}&tipo=${encodeURIComponent(tipo)}`);
  }

  // Obtener recomendaciones por prioridad
  getRecomendacionesByPrioridad(mascotaId: number, prioridad: string): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.baseUrl}/recomendaciones?mascotaId=${mascotaId}&prioridad=${encodeURIComponent(prioridad)}`);
  }

  // Generar recomendaciones usando IA (simulado en json-server)
  generarRecomendacionesIA(request: IARequest): Observable<IAResponse> {
    // Se guardará y devolverá un objeto IAResponse en la colección 'ia-respuestas'
    return this.http.post<IAResponse>(`${this.aiServiceUrl}/ia-respuestas`, {
      ...request,
      fechaGeneracion: new Date().toISOString()
    } as any);
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

  // Obtener estadísticas de recomendaciones (simulado)
  getEstadisticasRecomendaciones(mascotaId: number): Observable<{
    total: number;
    completadas: number;
    pendientes: number;
    vencidas: number;
    porTipo: Record<string, number>;
    porPrioridad: Record<string, number>;
  }> {
    return this.http
      .get<any[]>(`${this.baseUrl}/recomendaciones-estadisticas?mascotaId=${mascotaId}`)
      .pipe(map(arr => (arr && arr.length ? arr[0] : {
        total: 0,
        completadas: 0,
        pendientes: 0,
        vencidas: 0,
        porTipo: {},
        porPrioridad: {}
      })));
  }
}




