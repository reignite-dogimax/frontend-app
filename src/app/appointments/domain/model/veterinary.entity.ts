import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a Veterinary entity in the application.
 * @remarks
 * This class is used as a domain model for veterinaries in the appointments context.
 */
export class Veterinary implements BaseEntity {
  private _id: number;
  private _nombre: string;
  private _direccion: string;
  private _telefono: string;
  private _servicios: string[];
  private _horario: string;

  constructor(veterinary: {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    servicios: string[];
    horario: string;
  }) {
    this._id = veterinary.id;
    this._nombre = veterinary.nombre;
    this._direccion = veterinary.direccion;
    this._telefono = veterinary.telefono;
    this._servicios = veterinary.servicios;
    this._horario = veterinary.horario;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get nombre(): string {
    return this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  get direccion(): string {
    return this._direccion;
  }

  set direccion(value: string) {
    this._direccion = value;
  }

  get telefono(): string {
    return this._telefono;
  }

  set telefono(value: string) {
    this._telefono = value;
  }

  get servicios(): string[] {
    return this._servicios;
  }

  set servicios(value: string[]) {
    this._servicios = value;
  }

  get horario(): string {
    return this._horario;
  }

  set horario(value: string) {
    this._horario = value;
  }
}
