import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a HistorialMedico entity in the application.
 * @remarks
 * This class is used as a domain model for medical history in the Gestion context.
 */
export class HistorialMedico implements BaseEntity {
  private _id: number;
  private _mascotaId: number;
  private _fechaRegistro: Date;
  private _tipoRegistro: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento';
  private _descripcion: string;
  private _veterinario?: string;
  private _observaciones?: string;
  private _archivos?: string[];
  private _costo?: number;
  private _proximaCita?: Date;

  constructor(historial: {
    id: number;
    mascotaId: number;
    fechaRegistro: Date;
    tipoRegistro: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento';
    descripcion: string;
    veterinario?: string;
    observaciones?: string;
    archivos?: string[];
    costo?: number;
    proximaCita?: Date;
  }) {
    this._id = historial.id;
    this._mascotaId = historial.mascotaId;
    this._fechaRegistro = historial.fechaRegistro;
    this._tipoRegistro = historial.tipoRegistro;
    this._descripcion = historial.descripcion;
    this._veterinario = historial.veterinario;
    this._observaciones = historial.observaciones;
    this._archivos = historial.archivos;
    this._costo = historial.costo;
    this._proximaCita = historial.proximaCita;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get mascotaId(): number {
    return this._mascotaId;
  }

  set mascotaId(value: number) {
    this._mascotaId = value;
  }

  get fechaRegistro(): Date {
    return this._fechaRegistro;
  }

  set fechaRegistro(value: Date) {
    this._fechaRegistro = value;
  }

  get tipoRegistro(): 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento' {
    return this._tipoRegistro;
  }

  set tipoRegistro(value: 'Vacuna' | 'Consulta' | 'Cirugia' | 'Examen' | 'Tratamiento') {
    this._tipoRegistro = value;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  set descripcion(value: string) {
    this._descripcion = value;
  }

  get veterinario(): string | undefined {
    return this._veterinario;
  }

  set veterinario(value: string | undefined) {
    this._veterinario = value;
  }

  get observaciones(): string | undefined {
    return this._observaciones;
  }

  set observaciones(value: string | undefined) {
    this._observaciones = value;
  }

  get archivos(): string[] | undefined {
    return this._archivos;
  }

  set archivos(value: string[] | undefined) {
    this._archivos = value;
  }

  get costo(): number | undefined {
    return this._costo;
  }

  set costo(value: number | undefined) {
    this._costo = value;
  }

  get proximaCita(): Date | undefined {
    return this._proximaCita;
  }

  set proximaCita(value: Date | undefined) {
    this._proximaCita = value;
  }
}


