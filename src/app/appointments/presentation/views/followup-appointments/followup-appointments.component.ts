import { Component, computed, inject, signal } from '@angular/core';
import { AppointmentsStore } from '../../../application/appointments.store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../../iam/infrastructure/auth-storage.service';

interface PetWithCompletedAppointment {
  petId: number;
  petName: string;
  lastAppointmentDate: Date;
  lastAppointmentReason: string;
  completedAppointmentsCount: number;
}

@Component({
  selector: 'app-followup-appointments',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatButton,
    MatProgressSpinner,
    MatError,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule
  ],
  templateUrl: './followup-appointments.component.html',
  styleUrl: './followup-appointments.component.css'
})
export class FollowupAppointmentsComponent {
  readonly store = inject(AppointmentsStore);
  protected router = inject(Router);
  private authStorage = inject(AuthStorageService);

  selectedPetId = signal<number | null>(null);

  selectedPet = computed(() => {
    const petId = this.selectedPetId();
    if (!petId) return null;
    return this.petsWithCompletedAppointments().data.find(pet => pet.petId === petId) || null;
  });

  // Obtener mascotas con citas completadas por este veterinario
  petsWithCompletedAppointments = computed(() => {
    const currentUser = this.authStorage.getUser();
    if (!currentUser) {
      return { data: [] as PetWithCompletedAppointment[] };
    }

    // Filtrar citas completadas por este veterinario
    const completedAppointments = this.store.appointments().filter(apt => 
      apt.veterinaryStatus === 'COMPLETED' && 
      apt.veterinaryId === currentUser.id
    );

    // Agrupar por mascota
    const petMap = new Map<number, PetWithCompletedAppointment>();
    
    completedAppointments.forEach(apt => {
      const petId = apt.mascotaId;
      if (!petMap.has(petId)) {
        petMap.set(petId, {
          petId: petId,
          petName: this.getPetName(petId),
          lastAppointmentDate: new Date(apt.fechaHora),
          lastAppointmentReason: apt.motivo,
          completedAppointmentsCount: 1
        });
      } else {
        const existing = petMap.get(petId)!;
        const aptDate = new Date(apt.fechaHora);
        
        // Actualizar si esta cita es más reciente
        if (aptDate > existing.lastAppointmentDate) {
          existing.lastAppointmentDate = aptDate;
          existing.lastAppointmentReason = apt.motivo;
        }
        
        existing.completedAppointmentsCount++;
      }
    });

    const pets = Array.from(petMap.values()).sort((a, b) => 
      b.lastAppointmentDate.getTime() - a.lastAppointmentDate.getTime()
    );

    return { data: pets };
  });

  onPetSelected(): void {
    // Los detalles se actualizan automáticamente mediante el computed signal selectedPet
  }

  /**
   * Navigate to create follow-up appointment for a specific pet
   */
  createFollowUpForPet(petId: number) {
    this.router.navigate(['appointments/pet-lover/new'], { 
      queryParams: { 
        petId: petId,
        isFollowUp: true 
      } 
    }).then();
  }

  // Helper method to get pet name from ID
  getPetName(petId: number): string {
    const petNames: { [key: number]: string } = {
      1: 'Max',
      2: 'Luna', 
      3: 'Charlie',
      4: 'Bella',
      5: 'Rocky',
      6: 'Mia'
    };
    return petNames[petId] || `Mascota ${petId}`;
  }
}
