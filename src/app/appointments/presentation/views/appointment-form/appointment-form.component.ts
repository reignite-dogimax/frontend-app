import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsStore } from '../../../application/appointments.store';
import { Appointment } from '../../../domain/model/appointment.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
  CommonModule,
  TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(AppointmentsStore);
  private translate = inject(TranslateService);

  form = this.fb.group({
    mascotaId: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] }),
    veterinaryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    fechaHora: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    motivo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl<string>('En progreso', { nonNullable: true, validators: [Validators.required] }),
    notas: new FormControl<string>('', { nonNullable: true })
  });

  veterinaries = this.store.veterinaries;
  estados = ['En progreso', 'Cancelada'];
  isEdit = false;
  appointmentId: number | null = null;

  // Available pets for selection
  availablePets = [
    { id: 1, name: 'Max' },
    { id: 2, name: 'Luna' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Bella' },
    { id: 5, name: 'Rocky' },
    { id: 6, name: 'Mia' }
  ];

  constructor() {
    this.route.params.subscribe(params => {
      this.appointmentId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.appointmentId;
      if (this.isEdit && this.appointmentId) {
        const appointment = this.store.getAppointmentById(this.appointmentId)();
        if (appointment) {
          this.form.patchValue({
            mascotaId: appointment.mascotaId,
            veterinaryId: appointment.veterinaryId,
            fechaHora: appointment.fechaHora,
            motivo: appointment.motivo,
            estado: appointment.estado,
            notas: appointment.notas
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      alert(this.translate.instant('appointments.form.errors.fillRequired'));
      return;
    }

    const appointment: Appointment = new Appointment({
      id: this.appointmentId ?? 0,
      mascotaId: this.form.value.mascotaId!,
      veterinaryId: this.form.value.veterinaryId!,
      fechaHora: this.form.value.fechaHora!,
      motivo: this.form.value.motivo!,
      estado: this.form.value.estado!,
      notas: this.form.value.notas!
    });

    if (this.isEdit) {
      this.store.updateAppointment(appointment);
    } else {
      this.store.addAppointment(appointment);
    }

    this.router.navigate(['appointments']).then();
  }

  cancel() {
    this.router.navigate(['appointments']).then();
  }
}
