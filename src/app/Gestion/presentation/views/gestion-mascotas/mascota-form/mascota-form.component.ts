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
import { GestionStore } from '../../../../application/gestion.store';
import { TranslatePipe } from '@ngx-translate/core';
import { Pet } from '../../../../domain/model/pet.entity';

// Tipos temporales para las requests
interface CreateMascotaRequest {
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
}

interface UpdateMascotaRequest {
  nombre?: string;
  especie?: string;
  raza?: string;
  fechaNacimiento?: string;
  peso?: number;
  color?: string;
  sexo?: 'Macho' | 'Hembra';
  esterilizado?: boolean;
  observaciones?: string;
}

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
    MatProgressSpinnerModule,
    TranslatePipe
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
    private gestionStore: GestionStore
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

    // Usar el store para obtener la mascota
    const mascotaSignal = this.gestionStore.getMascotaById(id);
    const mascota = mascotaSignal();
    
    if (mascota) {
      this.mascotaForm.patchValue({
        nombre: mascota.name,
        especie: mascota.species,
        raza: mascota.breed,
        fechaNacimiento: mascota.birthDate ? new Date(mascota.birthDate) : null,
        peso: mascota.weight,
        color: mascota.color,
        sexo: mascota.gender === 'MALE' ? 'Macho' : mascota.gender === 'FEMALE' ? 'Hembra' : undefined,
        esterilizado: mascota.isNeutered,
        observaciones: mascota.observations
      });
    } else {
      this.error = 'Mascota no encontrada';
    }
    this.loading = false;
  }

  onSubmit(): void {
    if (this.mascotaForm.valid) {
      this.saving = true;
      this.error = null;

      const formValue = this.mascotaForm.value;
      
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

        // Crear entidad Pet para actualizar
        const mascotaSignal = this.gestionStore.getMascotaById(this.mascotaId);
        const mascotaExistente = mascotaSignal();
        
        if (mascotaExistente) {
          const mascotaActualizada = new Pet({
            id: mascotaExistente.id,
            userId: mascotaExistente.userId,
            name: updateData.nombre || mascotaExistente.name,
            species: updateData.especie || mascotaExistente.species,
            breed: updateData.raza || mascotaExistente.breed,
            birthDate: updateData.fechaNacimiento || mascotaExistente.birthDate,
            weight: updateData.peso || mascotaExistente.weight,
            color: updateData.color || mascotaExistente.color,
            gender: updateData.sexo === 'Macho' ? 'MALE' : updateData.sexo === 'Hembra' ? 'FEMALE' : mascotaExistente.gender,
            isNeutered: updateData.esterilizado !== undefined ? updateData.esterilizado : mascotaExistente.isNeutered,
            observations: updateData.observaciones || mascotaExistente.observations,
            photo: mascotaExistente.photo,
            registrationDate: mascotaExistente.registrationDate,
            isActive: mascotaExistente.isActive
          });
          
          this.gestionStore.updateMascota(mascotaActualizada).subscribe({
            next: () => {
              this.saving = false;
              this.router.navigate(['/gestion-mascotas/mascotas', mascotaActualizada.id]);
            },
            error: () => {
              this.saving = false;
            }
          });
        } else {
          this.error = 'Mascota no encontrada para actualizar';
          this.saving = false;
        }
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

        // Crear nueva entidad Pet
        const nuevaMascota = new Pet({
          id: 0, // Se asignará automáticamente
          userId: createData.usuarioId,
          name: createData.nombre,
          species: createData.especie,
          breed: createData.raza,
          birthDate: createData.fechaNacimiento,
          weight: createData.peso,
          color: createData.color,
          gender: createData.sexo === 'Macho' ? 'MALE' : createData.sexo === 'Hembra' ? 'FEMALE' : undefined,
          isNeutered: createData.esterilizado,
          observations: createData.observaciones,
          registrationDate: new Date().toISOString(),
          isActive: true
        });
        
        this.gestionStore.addMascota(nuevaMascota).subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/gestion-mascotas/mascotas']);
          },
          error: () => {
            this.saving = false;
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
