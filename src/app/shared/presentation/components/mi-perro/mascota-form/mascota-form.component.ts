import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MascotaService } from '../../../../application/services/mascota.service';
import { CreateMascotaRequest, UpdateMascotaRequest } from '../../../../domain/models/mascota.model';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mascota-form.component.html',
  styleUrl: './mascota-form.component.css'
})
export class MascotaFormComponent implements OnInit {
  mascotaForm: FormGroup;
  isEditMode = false;
  mascotaId: number | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  especies = ['Perro', 'Gato', 'Conejo', 'Hamster', 'Ave', 'Otro'];
  sexos = ['Macho', 'Hembra'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService
  ) {
    this.mascotaForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id !== 'nueva') {
        this.isEditMode = true;
        this.mascotaId = +id;
        this.loadMascota(this.mascotaId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      especie: ['', Validators.required],
      raza: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fechaNacimiento: [null],
      peso: [null, [Validators.min(0.1), Validators.max(200)]],
      color: ['', Validators.maxLength(30)],
      sexo: [''],
      esterilizado: [false],
      observaciones: ['', Validators.maxLength(500)]
    });
  }

  loadMascota(id: number): void {
    this.loading = true;
    this.error = null;

    this.mascotaService.getMascotaById(id).subscribe({
      next: (mascota) => {
        this.mascotaForm.patchValue({
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza,
          fechaNacimiento: mascota.fechaNacimiento ? new Date(mascota.fechaNacimiento) : null,
          peso: mascota.peso,
          color: mascota.color,
          sexo: mascota.sexo,
          esterilizado: mascota.esterilizado,
          observaciones: mascota.observaciones
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar la mascota';
        this.loading = false;
        console.error('Error loading mascota:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.mascotaForm.valid) {
      this.saving = true;
      this.error = null;

      const formValue = this.mascotaForm.value as any;

      if (this.isEditMode && this.mascotaId) {
        const updateData: UpdateMascotaRequest = {
          nombre: formValue.nombre,
          especie: formValue.especie,
          raza: formValue.raza,
          fechaNacimiento: formValue.fechaNacimiento,
          peso: formValue.peso,
          color: formValue.color,
          sexo: formValue.sexo,
          esterilizado: formValue.esterilizado,
          observaciones: formValue.observaciones
        };

        this.mascotaService.updateMascota(this.mascotaId, updateData).subscribe({
          next: (mascota) => {
            this.saving = false;
            this.router.navigate(['/gestion-mascotas/mascotas', mascota.id]);
          },
          error: (error) => {
            this.error = 'Error al actualizar la mascota';
            this.saving = false;
            console.error('Error updating mascota:', error);
          }
        });
      } else {
        const createData: CreateMascotaRequest = {
          usuarioId: 501, // En una app real vendría del servicio de autenticación
          nombre: formValue.nombre,
          especie: formValue.especie,
          raza: formValue.raza,
          fechaNacimiento: formValue.fechaNacimiento,
          peso: formValue.peso,
          color: formValue.color,
          sexo: formValue.sexo,
          esterilizado: formValue.esterilizado,
          observaciones: formValue.observaciones
        };

        this.mascotaService.createMascota(createData).subscribe({
          next: (mascota) => {
            this.saving = false;
            this.router.navigate(['/gestion-mascotas/mascotas', mascota.id]);
          },
          error: (error) => {
            this.error = 'Error al crear la mascota';
            this.saving = false;
            console.error('Error creating mascota:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.mascotaForm.controls).forEach(key => {
      const control = this.mascotaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.mascotaId) {
      this.router.navigate(['/gestion-mascotas/mascotas', this.mascotaId]);
    } else {
      this.router.navigate(['/gestion-mascotas/mascotas']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.mascotaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} no puede tener más de ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldLabel(fieldName)} no puede ser mayor a ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      especie: 'Especie',
      raza: 'Raza',
      fechaNacimiento: 'Fecha de nacimiento',
      peso: 'Peso',
      color: 'Color',
      sexo: 'Sexo',
      observaciones: 'Observaciones'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.mascotaForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}




