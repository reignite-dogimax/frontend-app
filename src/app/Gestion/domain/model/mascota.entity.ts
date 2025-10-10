import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a Mascota entity in the application.
 * @remarks
 * This class is used as a domain model for pets in the Gestion context.
 */
export class Mascota implements BaseEntity {
  private _id: number;
  private _usuarioId: number;
  private _nombre: string;
  private _especie: string;
  private _raza: string;
  private _fechaNacimiento?: string;
  private _peso?: number;
  private _color?: string;
  private _sexo?: 'Macho' | 'Hembra';
  private _esterilizado?: boolean;
  private _observaciones?: string;
  private _foto?: string;
  private _fechaRegistro: string;
  private _activo: boolean;

  constructor(mascota: {
    id: number;
    usuarioId: number;
    nombre: string;
    especie: string;
    raza: string;
    fechaNacimiento?: string;
    peso?: number;
    color?: string;
    sexo?: 'Macho' | 'Hembra';
    esterilizado?: boolean;
    observaciones?: string;
    foto?: string;
    fechaRegistro: string;
    activo: boolean;
  }) {
    this._id = mascota.id;
    this._usuarioId = mascota.usuarioId;
    this._nombre = mascota.nombre;
    this._especie = mascota.especie;
    this._raza = mascota.raza;
    this._fechaNacimiento = mascota.fechaNacimiento;
    this._peso = mascota.peso;
    this._color = mascota.color;
    this._sexo = mascota.sexo;
    this._esterilizado = mascota.esterilizado;
    this._observaciones = mascota.observaciones;
    this._foto = mascota.foto;
    this._fechaRegistro = mascota.fechaRegistro;
    this._activo = mascota.activo;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get usuarioId(): number {
    return this._usuarioId;
  }

  set usuarioId(value: number) {
    this._usuarioId = value;
  }

  get nombre(): string {
    return this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  get especie(): string {
    return this._especie;
  }

  set especie(value: string) {
    this._especie = value;
  }

  get raza(): string {
    return this._raza;
  }

  set raza(value: string) {
    this._raza = value;
  }

  get fechaNacimiento(): string | undefined {
    return this._fechaNacimiento;
  }

  set fechaNacimiento(value: string | undefined) {
    this._fechaNacimiento = value;
  }

  get peso(): number | undefined {
    return this._peso;
  }

  set peso(value: number | undefined) {
    this._peso = value;
  }

  get color(): string | undefined {
    return this._color;
  }

  set color(value: string | undefined) {
    this._color = value;
  }

  get sexo(): 'Macho' | 'Hembra' | undefined {
    return this._sexo;
  }

  set sexo(value: 'Macho' | 'Hembra' | undefined) {
    this._sexo = value;
  }

  get esterilizado(): boolean | undefined {
    return this._esterilizado;
  }

  set esterilizado(value: boolean | undefined) {
    this._esterilizado = value;
  }

  get observaciones(): string | undefined {
    return this._observaciones;
  }

  set observaciones(value: string | undefined) {
    this._observaciones = value;
  }

  get foto(): string | undefined {
    return this._foto;
  }

  set foto(value: string | undefined) {
    this._foto = value;
  }

  get fechaRegistro(): string {
    return this._fechaRegistro;
  }

  set fechaRegistro(value: string) {
    this._fechaRegistro = value;
  }

  get activo(): boolean {
    return this._activo;
  }

  set activo(value: boolean) {
    this._activo = value;
  }
}


