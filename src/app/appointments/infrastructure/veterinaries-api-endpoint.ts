import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Veterinary } from '../domain/model/veterinary.entity';
import { VeterinaryResource, VeterinariesResponse } from './veterinaries-response';
import { VeterinaryAssembler } from './veterinary-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * API endpoint for managing veterinaries.
 */
export class VeterinariesApiEndpoint extends BaseApiEndpoint<Veterinary, VeterinaryResource, VeterinariesResponse, VeterinaryAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}${environment.veterinariesEndpoint}`, new VeterinaryAssembler());
  }
}
