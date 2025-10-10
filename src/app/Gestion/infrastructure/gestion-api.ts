import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Mascota } from '../domain/model/mascota.entity';
import { HistorialMedico } from '../domain/model/historial-medico.entity';
import { Recomendacion } from '../domain/model/recomendacion.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * API service for managing endpoints in the Gestion context.
 */
@Injectable({ providedIn: 'root' })
export class GestionApi extends BaseApi {

  constructor(private http: HttpClient) {
    super();
  }

  // Mascotas CRUD
  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>('https://dogimax-api.arroz.dev/mascotas');
  }

  getMascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`https://dogimax-api.arroz.dev/mascotas/${id}`);
  }

  getMascotasByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`https://dogimax-api.arroz.dev/mascotas?usuarioId=${usuarioId}`);
  }

  createMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>('https://dogimax-api.arroz.dev/mascotas', mascota);
  }

  updateMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`https://dogimax-api.arroz.dev/mascotas/${mascota.id}`, mascota);
  }

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`https://dogimax-api.arroz.dev/mascotas/${id}`);
  }

  // Historiales CRUD
  getHistoriales(): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>('https://dogimax-api.arroz.dev/historial-medico');
  }

  getHistorial(id: number): Observable<HistorialMedico> {
    return this.http.get<HistorialMedico>(`https://dogimax-api.arroz.dev/historial-medico/${id}`);
  }

  getHistorialesByMascota(mascotaId: number): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(`https://dogimax-api.arroz.dev/historial-medico?mascotaId=${mascotaId}`);
  }

  createHistorial(historial: HistorialMedico): Observable<HistorialMedico> {
    return this.http.post<HistorialMedico>('https://dogimax-api.arroz.dev/historial-medico', historial);
  }

  updateHistorial(historial: HistorialMedico): Observable<HistorialMedico> {
    return this.http.put<HistorialMedico>(`https://dogimax-api.arroz.dev/historial-medico/${historial.id}`, historial);
  }

  deleteHistorial(id: number): Observable<void> {
    return this.http.delete<void>(`https://dogimax-api.arroz.dev/historial-medico/${id}`);
  }

  // Recomendaciones CRUD
  getRecomendaciones(): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>('https://dogimax-api.arroz.dev/recomendaciones');
  }

  getRecomendacion(id: number): Observable<Recomendacion> {
    return this.http.get<Recomendacion>(`https://dogimax-api.arroz.dev/recomendaciones/${id}`);
  }

  getRecomendacionesByMascota(mascotaId: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`https://dogimax-api.arroz.dev/recomendaciones?mascotaId=${mascotaId}`);
  }

  createRecomendacion(recomendacion: Recomendacion): Observable<Recomendacion> {
    return this.http.post<Recomendacion>('https://dogimax-api.arroz.dev/recomendaciones', recomendacion);
  }

  updateRecomendacion(recomendacion: Recomendacion): Observable<Recomendacion> {
    return this.http.put<Recomendacion>(`https://dogimax-api.arroz.dev/recomendaciones/${recomendacion.id}`, recomendacion);
  }

  deleteRecomendacion(id: number): Observable<void> {
    return this.http.delete<void>(`https://dogimax-api.arroz.dev/recomendaciones/${id}`);
  }
}

