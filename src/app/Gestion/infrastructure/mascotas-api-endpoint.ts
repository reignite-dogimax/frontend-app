import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { Pet } from '../domain/model/pet.entity';
import { MascotaAssembler } from './mascota-assembler';
import { PetResponse, PetsResponse } from './gestion-response';
import { Observable, map } from 'rxjs';

/**
 * API endpoint for Pet operations.
 */
@Injectable({
  providedIn: 'root'
})
export class MascotasApiEndpoint extends BaseApiEndpoint<Pet> {
  
  constructor(http: HttpClient) {
    super(http, 'https://dogimax-api.arroz.dev/api/v1/pets');
  }

  /**
   * Gets all pets.
   * @returns Observable of Pet array.
   */
  getAll(): Observable<Pet[]> {
    return this.http.get<PetsResponse>(this.baseUrl).pipe(
      map(response => {
        const assembler = new MascotaAssembler();
        return assembler.toEntitiesFromResponse(response);
      })
    );
  }

  /**
   * Gets a pet by ID.
   * @param id - The pet ID.
   * @returns Observable of Pet.
   */
  getById(id: number): Observable<Pet> {
    return this.http.get<PetResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        const assembler = new MascotaAssembler();
        if (response.pet) {
          return assembler.toEntityFromResource(response.pet);
        }
        throw new Error('Pet not found');
      })
    );
  }

  /**
   * Creates a new mascota.
   * @param mascota - The mascota to create.
   * @returns Observable of created Mascota.
   */
  create(mascota: Mascota): Observable<Mascota> {
    const dto = MascotaAssembler.toDto(mascota);
    return this.http.post<MascotaResponse>(this.baseUrl, dto).pipe(
      map(response => {
        if (response.data) {
          return MascotaAssembler.fromDto(response.data);
        }
        throw new Error('Failed to create mascota');
      })
    );
  }

  /**
   * Updates an existing mascota.
   * @param mascota - The mascota to update.
   * @param id - The mascota ID.
   * @returns Observable of updated Mascota.
   */
  update(mascota: Mascota, id: number): Observable<Mascota> {
    const dto = MascotaAssembler.toDto(mascota);
    return this.http.put<MascotaResponse>(`${this.baseUrl}/${id}`, dto).pipe(
      map(response => {
        if (response.data) {
          return MascotaAssembler.fromDto(response.data);
        }
        throw new Error('Failed to update mascota');
      })
    );
  }

  /**
   * Deletes a mascota.
   * @param id - The mascota ID.
   * @returns Observable of void.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Gets mascotas by usuario ID.
   * @param usuarioId - The usuario ID.
   * @returns Observable of Mascota array.
   */
  getByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.http.get<MascotasResponse>(`${this.baseUrl}?usuarioId=${usuarioId}`).pipe(
      map(response => {
        if (response.data) {
          return MascotaAssembler.fromDtoArray(response.data);
        }
        return [];
      })
    );
  }
}

