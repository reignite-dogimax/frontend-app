import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentsStore } from '../../../application/appointments.store';
import { AuthStorageService } from '../../../../iam/infrastructure/auth-storage.service';

interface PetAppointmentHistory {
  petId: number;
  petName: string;
  totalAppointments: number;
  firstAppointment: Date;
  lastAppointment: Date;
  nextAppointment?: Date;
  completedAppointments: any[];
  pendingAppointments: any[];
  veterinaries: string[];
}

@Component({
  selector: 'app-my-pets-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './my-pets-history.component.html',
  styleUrl: './my-pets-history.component.css'
})
export class MyPetsHistoryComponent implements OnInit {
  readonly store = inject(AppointmentsStore);
  private readonly authStorage = inject(AuthStorageService);

  selectedPetId = signal<number | null>(null);
  displayedColumns: string[] = ['fechaHora', 'motivo', 'estado', 'veterinaryStatus', 'veterinary', 'details'];

  ngOnInit() {
    this.store.loadAppointments();
    // this.store.loadVeterinaries(); // Method is private, data loads automatically
  }

  // Get all pets that belong to current user and have appointment history
  petsHistory = computed(() => {
    const currentUser = this.authStorage.getUser();
    if (!currentUser) return [];

    const appointments = this.store.appointments();
    if (!appointments.length) return [];

    // Group appointments by pet
    const petAppointmentsMap = new Map<number, any[]>();
    
    appointments.forEach(appointment => {
      // Filter appointments for current user's pets only
      if (this.isPetOwnedByCurrentUser(appointment.mascotaId)) {
        if (!petAppointmentsMap.has(appointment.mascotaId)) {
          petAppointmentsMap.set(appointment.mascotaId, []);
        }
        petAppointmentsMap.get(appointment.mascotaId)!.push(appointment);
      }
    });

    // Convert to PetAppointmentHistory array
    const petsHistory: PetAppointmentHistory[] = [];
    
    petAppointmentsMap.forEach((petAppointments, petId) => {
      const sortedAppointments = petAppointments.sort((a, b) => 
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
      );

      const completedAppointments = sortedAppointments.filter(apt => 
        apt.veterinaryStatus === 'COMPLETED'
      );
      
      const pendingAppointments = sortedAppointments.filter(apt => 
        apt.veterinaryStatus !== 'COMPLETED' && apt.veterinaryStatus !== 'REJECTED'
      );

      const nextAppointment = pendingAppointments
        .filter(apt => new Date(apt.fechaHora) > new Date())
        .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())[0];

      // Get unique veterinaries
      const veterinaries = [...new Set(petAppointments.map(apt => {
        const vet = this.store.veterinaries().find(v => v.id === apt.veterinaryId);
        return vet ? vet.nombre : 'Veterinaria no encontrada';
      }))];

      petsHistory.push({
        petId: petId,
        petName: this.getPetName(petId),
        totalAppointments: petAppointments.length,
        firstAppointment: new Date(sortedAppointments[0].fechaHora),
        lastAppointment: new Date(sortedAppointments[sortedAppointments.length - 1].fechaHora),
        nextAppointment: nextAppointment ? new Date(nextAppointment.fechaHora) : undefined,
        completedAppointments,
        pendingAppointments,
        veterinaries
      });
    });

    return petsHistory.sort((a, b) => a.petName.localeCompare(b.petName));
  });

  // Get history for selected pet
  selectedPetHistory = computed(() => {
    const petId = this.selectedPetId();
    if (!petId) return null;
    
    return this.petsHistory().find(pet => pet.petId === petId) || null;
  });

  // Create table data source for appointments
  appointmentsDataSource = computed(() => {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return new MatTableDataSource([]);

    const allAppointments = [
      ...petHistory.completedAppointments,
      ...petHistory.pendingAppointments
    ].sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());

    return new MatTableDataSource(allAppointments);
  });

  onPetSelected() {
    // Method called when pet selection changes
    console.log('Selected pet:', this.selectedPetId());
  }

  // Helper method to check if pet belongs to current user
  private isPetOwnedByCurrentUser(petId: number): boolean {
    const currentUser = this.authStorage.getUser();
    if (!currentUser) return false;
    
    // In a real application, you would check against a pets service
    // For now, assuming pets 1-6 belong to the current user based on seeder
    return petId >= 1 && petId <= 6;
  }

  // Get veterinary name by ID
  getVeterinaryName(veterinaryId: number): string {
    const veterinary = this.store.veterinaries().find(v => v.id === veterinaryId);
    return veterinary ? veterinary.nombre : 'No asignada';
  }

  // Get status color for chips
  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'primary';
      case 'accepted':
        return 'accent';
      case 'pending':
        return 'warn';
      default:
        return 'primary';
    }
  }

  // Get most common reasons for selected pet
  getMostCommonReasons(): { reason: string; count: number }[] {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return [];

    const reasonsMap = new Map<string, number>();
    
    petHistory.completedAppointments.forEach(appointment => {
      const reason = appointment.motivo;
      reasonsMap.set(reason, (reasonsMap.get(reason) || 0) + 1);
    });

    return Array.from(reasonsMap.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3 reasons
  }

  // Get appointments by month for chart
  getAppointmentsByMonth(): { month: string; count: number }[] {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return [];

    const monthsMap = new Map<string, number>();
    
    petHistory.completedAppointments.forEach(appointment => {
      const date = new Date(appointment.fechaHora);
      const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      monthsMap.set(monthKey, (monthsMap.get(monthKey) || 0) + 1);
    });

    return Array.from(monthsMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        // Sort by date (newest first)
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        return new Date(`${monthB} 20${yearB}`).getTime() - new Date(`${monthA} 20${yearA}`).getTime();
      });
  }

  // Calculate health score based on appointment frequency and type
  getHealthScore(): number {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return 0;

    let score = 85; // Base score

    // Bonus for regular checkups
    const consultaGeneral = petHistory.completedAppointments.filter(apt => 
      apt.motivo.toLowerCase().includes('consulta general')
    ).length;
    score += Math.min(consultaGeneral * 5, 15);

    // Bonus for vaccinations
    const vaccinations = petHistory.completedAppointments.filter(apt => 
      apt.motivo.toLowerCase().includes('vacun')
    ).length;
    score += Math.min(vaccinations * 3, 10);

    // Penalty for missed appointments
    const missedAppointments = petHistory.pendingAppointments.filter(apt => 
      new Date(apt.fechaHora) < new Date() && apt.veterinaryStatus === 'PENDING'
    ).length;
    score -= missedAppointments * 5;

    return Math.min(Math.max(score, 0), 100);
  }

  // Get next recommended action
  getNextRecommendedAction(): string {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return '';

    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));

    const recentCheckup = petHistory.completedAppointments.find(apt => 
      new Date(apt.fechaHora) > sixMonthsAgo && 
      apt.motivo.toLowerCase().includes('consulta general')
    );

    const recentVaccination = petHistory.completedAppointments.find(apt => 
      new Date(apt.fechaHora) > new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000)) && 
      apt.motivo.toLowerCase().includes('vacun')
    );

    if (!recentCheckup) {
      return 'Programar consulta general de rutina';
    } else if (!recentVaccination) {
      return 'Verificar calendario de vacunación';
    } else if (petHistory.nextAppointment) {
      return `Próxima cita: ${petHistory.nextAppointment.toLocaleDateString()}`;
    } else {
      return 'Mantener controles regulares';
    }
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