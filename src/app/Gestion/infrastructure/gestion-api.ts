import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Pet } from '../domain/model/pet.entity';
import { MedicalHistory } from '../domain/model/medical-history.entity';
import { Recommendation } from '../domain/model/recommendation.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MascotaAssembler } from './mascota-assembler';
import { HistorialMedicoAssembler } from './historial-medico-assembler';
import { RecomendacionAssembler } from './recomendacion-assembler';
import { PetResource, MedicalHistoryResource, RecommendationResource } from './gestion-response';

/**
 * API service for managing endpoints in the Gestion context.
 */
@Injectable({ providedIn: 'root' })
export class GestionApi extends BaseApi {

  private readonly baseUrl = environment.apiUrl;
  private readonly petsEndpoint = `${this.baseUrl}${environment.petsEndpoint}`;
  private readonly medicalHistoriesEndpoint = `${this.baseUrl}${environment.medicalHistoriesEndpoint}`;
  private readonly recommendationsEndpoint = `${this.baseUrl}${environment.recommendationsEndpoint}`;
  private readonly mascotaAssembler = new MascotaAssembler();
  private readonly historialAssembler = new HistorialMedicoAssembler();
  private readonly recomendacionAssembler = new RecomendacionAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  // Pets CRUD
  getMascotas(): Observable<Pet[]> {
    return this.http.get<PetResource[]>(this.petsEndpoint).pipe(
      map(resources => resources.map(r => this.mascotaAssembler.toEntityFromResource(r)))
    );
  }

  getMascota(id: number): Observable<Pet> {
    return this.http.get<PetResource>(`${this.petsEndpoint}/${id}`).pipe(
      map(resource => this.mascotaAssembler.toEntityFromResource(resource))
    );
  }

  getMascotasByUsuario(usuarioId: number): Observable<Pet[]> {
    return this.http.get<PetResource[]>(`${this.petsEndpoint}/user/${usuarioId}`).pipe(
      map(resources => resources.map(r => this.mascotaAssembler.toEntityFromResource(r)))
    );
  }

  createMascota(mascota: Pet): Observable<Pet> {
    const resource = this.mascotaAssembler.toResourceFromEntity(mascota);
    return this.http.post<PetResource>(this.petsEndpoint, resource).pipe(
      map(r => this.mascotaAssembler.toEntityFromResource(r))
    );
  }

  updateMascota(mascota: Pet): Observable<Pet> {
    const resource = this.mascotaAssembler.toResourceFromEntity(mascota);
    return this.http.put<PetResource>(`${this.petsEndpoint}/${mascota.id}`, resource).pipe(
      map(r => this.mascotaAssembler.toEntityFromResource(r))
    );
  }

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.petsEndpoint}/${id}`);
  }

  // Medical Histories CRUD
  getHistoriales(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistoryResource[]>(this.medicalHistoriesEndpoint).pipe(
      map(resources => resources.map(r => this.historialAssembler.toEntityFromResource(r)))
    );
  }

  getHistorial(id: number): Observable<MedicalHistory> {
    return this.http.get<MedicalHistoryResource>(`${this.medicalHistoriesEndpoint}/${id}`).pipe(
      map(resource => this.historialAssembler.toEntityFromResource(resource))
    );
  }

  getHistorialesByMascota(mascotaId: number): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistoryResource[]>(`${this.medicalHistoriesEndpoint}?petId=${mascotaId}`).pipe(
      map(resources => resources.map(r => this.historialAssembler.toEntityFromResource(r)))
    );
  }

  createHistorial(historial: MedicalHistory): Observable<MedicalHistory> {
    const resource = this.historialAssembler.toResourceFromEntity(historial);
    return this.http.post<MedicalHistoryResource>(this.medicalHistoriesEndpoint, resource).pipe(
      map(r => this.historialAssembler.toEntityFromResource(r))
    );
  }

  updateHistorial(historial: MedicalHistory): Observable<MedicalHistory> {
    const resource = this.historialAssembler.toResourceFromEntity(historial);
    return this.http.put<MedicalHistoryResource>(`${this.medicalHistoriesEndpoint}/${historial.id}`, resource).pipe(
      map(r => this.historialAssembler.toEntityFromResource(r))
    );
  }

  deleteHistorial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.medicalHistoriesEndpoint}/${id}`);
  }

  // Recommendations CRUD
  getRecomendaciones(): Observable<Recommendation[]> {
    return this.http.get<RecommendationResource[]>(this.recommendationsEndpoint).pipe(
      map(resources => resources.map(r => this.recomendacionAssembler.toEntityFromResource(r)))
    );
  }

  getRecomendacion(id: number): Observable<Recommendation> {
    return this.http.get<RecommendationResource>(`${this.recommendationsEndpoint}/${id}`).pipe(
      map(resource => this.recomendacionAssembler.toEntityFromResource(resource))
    );
  }

  getRecomendacionesByMascota(mascotaId: number): Observable<Recommendation[]> {
    return this.http.get<RecommendationResource[]>(`${this.recommendationsEndpoint}?petId=${mascotaId}`).pipe(
      map(resources => resources.map(r => this.recomendacionAssembler.toEntityFromResource(r)))
    );
  }

  createRecomendacion(recomendacion: Recommendation): Observable<Recommendation> {
    const resource = this.recomendacionAssembler.toResourceFromEntity(recomendacion);
    return this.http.post<RecommendationResource>(this.recommendationsEndpoint, resource).pipe(
      map(r => this.recomendacionAssembler.toEntityFromResource(r))
    );
  }

  updateRecomendacion(recomendacion: Recommendation): Observable<Recommendation> {
    const resource = this.recomendacionAssembler.toResourceFromEntity(recomendacion);
    return this.http.put<RecommendationResource>(`${this.recommendationsEndpoint}/${recomendacion.id}`, resource).pipe(
      map(r => this.recomendacionAssembler.toEntityFromResource(r))
    );
  }

  deleteRecomendacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.recommendationsEndpoint}/${id}`);
  }

  /**
   * Call n8n webhook to generate AI recommendations for a pet
   * @param petData - Complete pet data to send to the AI
   * @returns Observable with AI recommendation response
   */
  generateAIRecommendation(petData: any): Observable<any> {
    const webhookUrl = environment.n8nWebhookUrl;
    return this.http.post<any>(webhookUrl, petData);
  }
}