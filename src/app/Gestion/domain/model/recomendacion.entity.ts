import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a Recomendacion entity in the application.
 * @remarks
 * This class is used as a domain model for recommendations in the Gestion context.
 */
export class Recomendacion implements BaseEntity {
  private _id: number;
  private _mascotaId: number;
  private _tipo: 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento' | 'Cuidados' | 'Vacunacion';
  private _titulo: string;
  private _descripcion: string;
  private _prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
  private _fechaGeneracion: Date;
  private _fechaVencimiento?: Date;
  private _completada: boolean;
  private _fechaCompletada?: Date;
  private _fuenteIA: string;
  private _confianza: number;
  private _parametros?: Record<string, any>;

  constructor(recomendacion: {
    id: number;
    mascotaId: number;
    tipo: 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento' | 'Cuidados' | 'Vacunacion';
    titulo: string;
    descripcion: string;
    prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
    fechaGeneracion: Date;
    fechaVencimiento?: Date;
    completada: boolean;
    fechaCompletada?: Date;
    fuenteIA: string;
    confianza: number;
    parametros?: Record<string, any>;
  }) {
    this._id = recomendacion.id;
    this._mascotaId = recomendacion.mascotaId;
    this._tipo = recomendacion.tipo;
    this._titulo = recomendacion.titulo;
    this._descripcion = recomendacion.descripcion;
    this._prioridad = recomendacion.prioridad;
    this._fechaGeneracion = recomendacion.fechaGeneracion;
    this._fechaVencimiento = recomendacion.fechaVencimiento;
    this._completada = recomendacion.completada;
    this._fechaCompletada = recomendacion.fechaCompletada;
    this._fuenteIA = recomendacion.fuenteIA;
    this._confianza = recomendacion.confianza;
    this._parametros = recomendacion.parametros;
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

  get tipo(): 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento' | 'Cuidados' | 'Vacunacion' {
    return this._tipo;
  }

  set tipo(value: 'Alimentacion' | 'Ejercicio' | 'Salud' | 'Comportamiento' | 'Cuidados' | 'Vacunacion') {
    this._tipo = value;
  }

  get titulo(): string {
    return this._titulo;
  }

  set titulo(value: string) {
    this._titulo = value;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  set descripcion(value: string) {
    this._descripcion = value;
  }

  get prioridad(): 'Baja' | 'Media' | 'Alta' | 'Critica' {
    return this._prioridad;
  }

  set prioridad(value: 'Baja' | 'Media' | 'Alta' | 'Critica') {
    this._prioridad = value;
  }

  get fechaGeneracion(): Date {
    return this._fechaGeneracion;
  }

  set fechaGeneracion(value: Date) {
    this._fechaGeneracion = value;
  }

  get fechaVencimiento(): Date | undefined {
    return this._fechaVencimiento;
  }

  set fechaVencimiento(value: Date | undefined) {
    this._fechaVencimiento = value;
  }

  get completada(): boolean {
    return this._completada;
  }

  set completada(value: boolean) {
    this._completada = value;
  }

  get fechaCompletada(): Date | undefined {
    return this._fechaCompletada;
  }

  set fechaCompletada(value: Date | undefined) {
    this._fechaCompletada = value;
  }

  get fuenteIA(): string {
    return this._fuenteIA;
  }

  set fuenteIA(value: string) {
    this._fuenteIA = value;
  }

  get confianza(): number {
    return this._confianza;
  }

  set confianza(value: number) {
    this._confianza = value;
  }

  get parametros(): Record<string, any> | undefined {
    return this._parametros;
  }

  set parametros(value: Record<string, any> | undefined) {
    this._parametros = value;
  }
}


