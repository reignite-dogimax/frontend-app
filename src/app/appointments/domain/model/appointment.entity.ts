import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Veterinary } from './veterinary.entity';

/**
 * Represents an Appointment entity in the application.
 * @remarks
 * This class is used as a domain model for appointments in the appointments context.
 */
export class Appointment implements BaseEntity {
  private _id: number;
  private _mascotaId: number;
  private _veterinariaId: number;
  private _fechaHora: string;
  private _motivo: string;
  private _estado: string;
  private _notas: string;
  private _veterinary: Veterinary | null;

  constructor(appointment: {
    id: number;
    mascotaId: number;
    veterinariaId: number;
    fechaHora: string;
    motivo: string;
    estado: string;
    notas: string;
  }) {
    this._id = appointment.id;
    this._mascotaId = appointment.mascotaId;
    this._veterinariaId = appointment.veterinariaId;
    this._fechaHora = appointment.fechaHora;
    this._motivo = appointment.motivo;
    this._estado = appointment.estado;
    this._notas = appointment.notas;
    this._veterinary = null;
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

  get veterinariaId(): number {
    return this._veterinariaId;
  }

  set veterinariaId(value: number) {
    this._veterinariaId = value;
  }

  get fechaHora(): string {
    return this._fechaHora;
  }

  set fechaHora(value: string) {
    this._fechaHora = value;
  }

  get motivo(): string {
    return this._motivo;
  }

  set motivo(value: string) {
    this._motivo = value;
  }

  get estado(): string {
    return this._estado;
  }

  set estado(value: string) {
    this._estado = value;
  }

  get notas(): string {
    return this._notas;
  }

  set notas(value: string) {
    this._notas = value;
  }

  get veterinary(): Veterinary | null {
    return this._veterinary;
  }

  set veterinary(value: Veterinary | null) {
    this._veterinary = value;
  }
}
