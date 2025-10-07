import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Appointment } from '../domain/model/appointment.entity';
import { AppointmentResource, AppointmentsResponse } from './appointments-response';
import { AppointmentAssembler } from './appointment-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * API endpoint for managing appointments.
 */
export class AppointmentsApiEndpoint extends BaseApiEndpoint<Appointment, AppointmentResource, AppointmentsResponse, AppointmentAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}${environment.appointmentsEndpoint}`, new AppointmentAssembler());
  }
}
