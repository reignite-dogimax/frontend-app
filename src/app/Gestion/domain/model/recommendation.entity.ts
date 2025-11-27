import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a Recommendation entity in the application.
 * @remarks
 * This class is used as a domain model for recommendations in the Gestion context.
 */
export class Recommendation implements BaseEntity {
  private _id: number;
  private _petId: number;
  private _type: 'NUTRITION' | 'EXERCISE' | 'HEALTH' | 'BEHAVIOR' | 'CARE' | 'VACCINATION';
  private _title: string;
  private _description: string;
  private _priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  private _generationDate: Date;
  private _expirationDate?: Date;
  private _isCompleted: boolean;
  private _completionDate?: Date;
  private _aiSource: string;
  private _confidence: number;
  private _parameters?: string;

  constructor(recommendation: {
    id: number;
    petId: number;
    type: 'NUTRITION' | 'EXERCISE' | 'HEALTH' | 'BEHAVIOR' | 'CARE' | 'VACCINATION';
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    generationDate: Date;
    expirationDate?: Date;
    isCompleted: boolean;
    completionDate?: Date;
    aiSource: string;
    confidence: number;
    parameters?: string;
  }) {
    this._id = recommendation.id;
    this._petId = recommendation.petId;
    this._type = recommendation.type;
    this._title = recommendation.title;
    this._description = recommendation.description;
    this._priority = recommendation.priority;
    this._generationDate = recommendation.generationDate;
    this._expirationDate = recommendation.expirationDate;
    this._isCompleted = recommendation.isCompleted;
    this._completionDate = recommendation.completionDate;
    this._aiSource = recommendation.aiSource;
    this._confidence = recommendation.confidence;
    this._parameters = recommendation.parameters;
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

  get type(): 'NUTRITION' | 'EXERCISE' | 'HEALTH' | 'BEHAVIOR' | 'CARE' | 'VACCINATION' {
    return this._type;
  }

  set type(value: 'NUTRITION' | 'EXERCISE' | 'HEALTH' | 'BEHAVIOR' | 'CARE' | 'VACCINATION') {
    this._type = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get priority(): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    return this._priority;
  }

  set priority(value: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
    this._priority = value;
  }

  get generationDate(): Date {
    return this._generationDate;
  }

  set generationDate(value: Date) {
    this._generationDate = value;
  }

  get expirationDate(): Date | undefined {
    return this._expirationDate;
  }

  set expirationDate(value: Date | undefined) {
    this._expirationDate = value;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  set isCompleted(value: boolean) {
    this._isCompleted = value;
  }

  get completionDate(): Date | undefined {
    return this._completionDate;
  }

  set completionDate(value: Date | undefined) {
    this._completionDate = value;
  }

  get aiSource(): string {
    return this._aiSource;
  }

  set aiSource(value: string) {
    this._aiSource = value;
  }

  get confidence(): number {
    return this._confidence;
  }

  set confidence(value: number) {
    this._confidence = value;
  }

  get parameters(): string | undefined {
    return this._parameters;
  }

  set parameters(value: string | undefined) {
    this._parameters = value;
  }
}
