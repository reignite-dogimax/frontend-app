import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a Pet entity in the application.
 * @remarks
 * This class is used as a domain model for pets in the Gestion context.
 */
export class Pet implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _name: string;
  private _species: string;
  private _breed: string;
  private _birthDate?: string;
  private _weight?: number;
  private _color?: string;
  private _gender?: 'MALE' | 'FEMALE';
  private _isNeutered?: boolean;
  private _observations?: string;
  private _photo?: string;
  private _registrationDate: string;
  private _isActive: boolean;

  constructor(pet: {
    id: number;
    userId: number;
    name: string;
    species: string;
    breed: string;
    birthDate?: string;
    weight?: number;
    color?: string;
    gender?: 'MALE' | 'FEMALE';
    isNeutered?: boolean;
    observations?: string;
    photo?: string;
    registrationDate: string;
    isActive: boolean;
  }) {
    this._id = pet.id;
    this._userId = pet.userId;
    this._name = pet.name;
    this._species = pet.species;
    this._breed = pet.breed;
    this._birthDate = pet.birthDate;
    this._weight = pet.weight;
    this._color = pet.color;
    this._gender = pet.gender;
    this._isNeutered = pet.isNeutered;
    this._observations = pet.observations;
    this._photo = pet.photo;
    this._registrationDate = pet.registrationDate;
    this._isActive = pet.isActive;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get species(): string {
    return this._species;
  }

  set species(value: string) {
    this._species = value;
  }

  get breed(): string {
    return this._breed;
  }

  set breed(value: string) {
    this._breed = value;
  }

  get birthDate(): string | undefined {
    return this._birthDate;
  }

  set birthDate(value: string | undefined) {
    this._birthDate = value;
  }

  get weight(): number | undefined {
    return this._weight;
  }

  set weight(value: number | undefined) {
    this._weight = value;
  }

  get color(): string | undefined {
    return this._color;
  }

  set color(value: string | undefined) {
    this._color = value;
  }

  get gender(): 'MALE' | 'FEMALE' | undefined {
    return this._gender;
  }

  set gender(value: 'MALE' | 'FEMALE' | undefined) {
    this._gender = value;
  }

  get isNeutered(): boolean | undefined {
    return this._isNeutered;
  }

  set isNeutered(value: boolean | undefined) {
    this._isNeutered = value;
  }

  get observations(): string | undefined {
    return this._observations;
  }

  set observations(value: string | undefined) {
    this._observations = value;
  }

  get photo(): string | undefined {
    return this._photo;
  }

  set photo(value: string | undefined) {
    this._photo = value;
  }

  get registrationDate(): string {
    return this._registrationDate;
  }

  set registrationDate(value: string) {
    this._registrationDate = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }
}
