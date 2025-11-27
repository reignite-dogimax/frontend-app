import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a MedicalHistory entity in the application.
 * @remarks
 * This class is used as a domain model for medical history in the Gestion context.
 */
export class MedicalHistory implements BaseEntity {
  private _id: number;
  private _petId: number;
  private _registrationDate: Date;
  private _recordType: 'VACCINATION' | 'CONSULTATION' | 'SURGERY' | 'EXAM' | 'TREATMENT';
  private _description: string;
  private _veterinarian?: string;
  private _observations?: string;
  private _files?: string;
  private _cost?: number;
  private _nextAppointment?: Date;

  constructor(history: {
    id: number;
    petId: number;
    registrationDate: Date;
    recordType: 'VACCINATION' | 'CONSULTATION' | 'SURGERY' | 'EXAM' | 'TREATMENT';
    description: string;
    veterinarian?: string;
    observations?: string;
    files?: string;
    cost?: number;
    nextAppointment?: Date;
  }) {
    this._id = history.id;
    this._petId = history.petId;
    this._registrationDate = history.registrationDate;
    this._recordType = history.recordType;
    this._description = history.description;
    this._veterinarian = history.veterinarian;
    this._observations = history.observations;
    this._files = history.files;
    this._cost = history.cost;
    this._nextAppointment = history.nextAppointment;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get petId(): number {
    return this._petId;
  }

  set petId(value: number) {
    this._petId = value;
  }

  get registrationDate(): Date {
    return this._registrationDate;
  }

  set registrationDate(value: Date) {
    this._registrationDate = value;
  }

  get recordType(): 'VACCINATION' | 'CONSULTATION' | 'SURGERY' | 'EXAM' | 'TREATMENT' {
    return this._recordType;
  }

  set recordType(value: 'VACCINATION' | 'CONSULTATION' | 'SURGERY' | 'EXAM' | 'TREATMENT') {
    this._recordType = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get veterinarian(): string | undefined {
    return this._veterinarian;
  }

  set veterinarian(value: string | undefined) {
    this._veterinarian = value;
  }

  get observations(): string | undefined {
    return this._observations;
  }

  set observations(value: string | undefined) {
    this._observations = value;
  }

  get files(): string | undefined {
    return this._files;
  }

  set files(value: string | undefined) {
    this._files = value;
  }

  get cost(): number | undefined {
    return this._cost;
  }

  set cost(value: number | undefined) {
    this._cost = value;
  }

  get nextAppointment(): Date | undefined {
    return this._nextAppointment;
  }

  set nextAppointment(value: Date | undefined) {
    this._nextAppointment = value;
  }
}
