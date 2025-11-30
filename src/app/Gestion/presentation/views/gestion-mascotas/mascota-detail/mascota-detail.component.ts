import { Component, OnInit, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GestionStore } from '../../../../application/gestion.store';
import { GestionApi } from '../../../../infrastructure/gestion-api';
import { Pet } from '../../../../domain/model/pet.entity';
import { MedicalHistory } from '../../../../domain/model/medical-history.entity';
import { Recommendation } from '../../../../domain/model/recommendation.entity';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mascota-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  templateUrl: './mascota-detail.component.html',
  styleUrl: './mascota-detail.component.css'
})
export class MascotaDetailComponent implements OnInit {
  mascota: Pet | null = null;
  mascotaId: number = 0;
  
  // Usar signals del store en lugar de variables locales
  historial!: Signal<MedicalHistory[]>;
  vacunas!: Signal<MedicalHistory[]>;
  recomendaciones!: Signal<Recommendation[]>;
  
  loading = false;
  generatingRecommendation = false;
  error: string | null = null;
  selectedTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gestionStore: GestionStore,
    private gestionApi: GestionApi,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.mascotaId = id;
        this.loadMascota(id);
        this.initializeSignals(id);
      }
    });
  }

  /**
   * Inicializa los signals reactivos que se conectan al store
   */
  private initializeSignals(mascotaId: number): void {
    // Conectar directamente a los signals del store
    this.historial = this.gestionStore.getHistorialesByMascota(mascotaId);
    this.recomendaciones = this.gestionStore.getRecomendacionesByMascota(mascotaId);
    
    // Crear un signal computed para las vacunas
    this.vacunas = computed(() => 
      this.historial().filter(h => 
        h.recordType?.toLowerCase() === 'vacuna' || 
        h.recordType?.toLowerCase() === 'vaccination'
      )
    );
  }

  loadMascota(id: number): void {
    this.loading = true;
    this.error = null;

    // Intentar obtener la mascota del store primero
    const mascotaSignal = this.gestionStore.getMascotaById(id);
    const mascota = mascotaSignal();
    
    if (mascota) {
      // Si existe en el store, usar esos datos
      this.mascota = mascota;
      // Dar un pequeño tiempo para que los datos filtrados estén listos
      setTimeout(() => {
        this.loading = false;
      }, 100);
    } else {
      // Si no existe en el store (por ejemplo, después de F5), llamar al API
      console.log('Mascota no encontrada en store, cargando desde API...');
      this.gestionApi.getMascota(id).subscribe({
        next: (mascotaFromApi) => {
          this.mascota = mascotaFromApi;
          // Los datos relacionados ya están en el store global
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar mascota desde API:', err);
          this.error = 'No se pudo cargar la información de la mascota';
          this.loading = false;
        }
      });
    }
  }

  loadRelatedData(mascotaId: number): void {
    // Ya no se usa, los datos se cargan directamente desde signals
    // Método mantenido por compatibilidad
  }

  getEdadMascota(fechaNacimiento?: string): string {
    if (!fechaNacimiento) return 'Edad no especificada';
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edadEnMeses = Math.floor((hoy.getTime() - nacimiento.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (edadEnMeses < 12) {
      return `${edadEnMeses} meses`;
    } else {
      const años = Math.floor(edadEnMeses / 12);
      const mesesRestantes = edadEnMeses % 12;
      return mesesRestantes > 0 ? `${años} años y ${mesesRestantes} meses` : `${años} años`;
    }
  }

  getEspecieIcon(especie: string): string {
    return especie.toLowerCase() === 'perro' ? 'pets' : 'pets';
  }

  getPrioridadColor(prioridad: string): string {
    const prioridadUpper = prioridad?.toUpperCase();
    switch (prioridadUpper) {
      case 'CRITICAL':
      case 'CRITICA':
        return 'chip-critical';
      case 'HIGH':
      case 'ALTA':
        return 'chip-high';
      case 'MEDIUM':
      case 'MEDIA':
        return 'chip-medium';
      case 'LOW':
      case 'BAJA':
        return 'chip-low';
      default:
        return 'chip-medium';
    }
  }

  getTipoIcon(tipo: string): string {
    const tipoUpper = tipo?.toUpperCase();
    switch (tipoUpper) {
      case 'VACCINATION':
      case 'VACUNA':
        return 'vaccines';
      case 'CONSULTATION':
      case 'CONSULTA':
        return 'medical_services';
      case 'SURGERY':
      case 'CIRUGIA':
        return 'healing';
      case 'EXAM':
      case 'EXAMEN':
        return 'science';
      case 'TREATMENT':
      case 'TRATAMIENTO':
        return 'medication';
      default:
        return 'medical_services';
    }
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  goBack(): void {
    this.router.navigate(['/gestion-mascotas/mascotas']);
  }

  generarRecomendaciones(): void {
    if (!this.mascota) {
      this.snackBar.open('No hay mascota seleccionada', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.generatingRecommendation = true;
    
    // Preparar datos completos de la mascota para enviar a la IA
    const petData = {
      id: this.mascota.id,
      name: this.mascota.name,
      species: this.mascota.species,
      breed: this.mascota.breed,
      birthDate: this.mascota.birthDate,
      age: this.getEdadMascota(this.mascota.birthDate),
      weight: this.mascota.weight,
      color: this.mascota.color,
      gender: this.mascota.gender,
      isNeutered: this.mascota.isNeutered,
      observations: this.mascota.observations,
      medicalHistory: this.historial().map(h => ({
        date: h.registrationDate,
        type: h.recordType,
        description: h.description,
        veterinarian: h.veterinarian,
        observations: h.observations
      })),
      vaccinations: this.vacunas().map(v => ({
        date: v.registrationDate,
        description: v.description,
        nextAppointment: v.nextAppointment
      })),
      existingRecommendations: this.recomendaciones().map(r => ({
        type: r.type,
        title: r.title,
        description: r.description,
        isCompleted: r.isCompleted
      }))
    };

    console.log('Enviando datos al webhook de IA:', petData);

    // Llamar al webhook de n8n para generar recomendación
    this.gestionApi.generateAIRecommendation(petData).pipe(
      finalize(() => this.generatingRecommendation = false)
    ).subscribe({
      next: (aiResponse) => {
        console.log('Respuesta de IA recibida:', aiResponse);
        this.processAndSaveAIRecommendation(aiResponse);
      },
      error: (error) => {
        console.error('Error al generar recomendación:', error);
        this.snackBar.open('Error al generar recomendación con IA', 'Cerrar', { duration: 5000 });
      }
    });
  }

  /**
   * Mapea la respuesta de la IA al formato de Recommendation y la guarda en el backend
   */
  private processAndSaveAIRecommendation(aiResponse: any): void {
    // La respuesta viene como un array con un objeto que tiene un campo "output"
    let aiText = '';
    
    if (Array.isArray(aiResponse) && aiResponse.length > 0 && aiResponse[0].output) {
      aiText = aiResponse[0].output;
    } else if (typeof aiResponse === 'string') {
      aiText = aiResponse;
    } else if (aiResponse.output) {
      aiText = aiResponse.output;
    } else {
      console.error('Formato de respuesta inesperado:', aiResponse);
      this.snackBar.open('Error: Formato de respuesta inválido', 'Cerrar', { duration: 5000 });
      return;
    }

    console.log('Texto de IA recibido:', aiText);

    // Parsear el texto y extraer las recomendaciones principales
    const recommendations = this.parseAIRecommendations(aiText);
    
    if (recommendations.length === 0) {
      this.snackBar.open('No se pudieron extraer recomendaciones del texto', 'Cerrar', { duration: 5000 });
      return;
    }

    // Guardar cada recomendación en el backend
    let savedCount = 0;
    let errorCount = 0;

    recommendations.forEach((rec, index) => {
      this.gestionStore.addRecomendacion(rec).subscribe({
        next: (savedRecommendation) => {
          console.log(`Recomendación ${index + 1} guardada:`, savedRecommendation);
          savedCount++;
          
          // Mostrar mensaje solo cuando se hayan procesado todas
          if (savedCount + errorCount === recommendations.length) {
            if (errorCount === 0) {
              this.snackBar.open(`✨ ${savedCount} recomendación(es) generada(s) exitosamente`, 'Cerrar', { duration: 4000 });
            } else {
              this.snackBar.open(`⚠️ ${savedCount} guardadas, ${errorCount} fallaron`, 'Cerrar', { duration: 5000 });
            }
          }
        },
        error: (error) => {
          console.error(`Error al guardar recomendación ${index + 1}:`, error);
          errorCount++;
          
          if (savedCount + errorCount === recommendations.length) {
            if (savedCount > 0) {
              this.snackBar.open(`⚠️ ${savedCount} guardadas, ${errorCount} fallaron`, 'Cerrar', { duration: 5000 });
            } else {
              this.snackBar.open('Error al guardar las recomendaciones', 'Cerrar', { duration: 5000 });
            }
          }
        }
      });
    });
  }

  /**
   * Parsea el texto de la IA y extrae recomendaciones estructuradas
   */
  private parseAIRecommendations(aiText: string): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Patrones para identificar secciones de recomendaciones
    const sectionPattern = /\d+\.\s+\*\*([^:*]+)(?:\s*\(([^)]+)\))?:\*\*/g;
    const bulletPattern = /\*\s+\*\*([^:*]+):\*\*\s*([^\n]+(?:\n(?!\*)[^\n]+)*)/g;
    
    let sectionMatch;
    let sectionIndex = 0;
    
    // Extraer cada sección numerada (1., 2., 3., etc.)
    while ((sectionMatch = sectionPattern.exec(aiText)) !== null) {
      const sectionTitle = sectionMatch[1].trim();
      const sectionNote = sectionMatch[2] ? sectionMatch[2].trim() : '';
      const sectionStart = sectionMatch.index + sectionMatch[0].length;
      
      // Buscar el inicio de la siguiente sección o el final del texto
      const nextSectionMatch = sectionPattern.exec(aiText);
      const sectionEnd = nextSectionMatch ? nextSectionMatch.index : aiText.length;
      sectionPattern.lastIndex = sectionStart; // Resetear índice
      
      // Extraer el contenido de esta sección
      const sectionContent = aiText.substring(sectionStart, sectionEnd);
      
      // Extraer los bullet points de esta sección
      const bullets: string[] = [];
      let bulletMatch;
      const bulletRegex = new RegExp(bulletPattern);
      
      while ((bulletMatch = bulletRegex.exec(sectionContent)) !== null) {
        const bulletTitle = bulletMatch[1].trim();
        const bulletContent = bulletMatch[2].trim();
        bullets.push(`${bulletTitle}: ${bulletContent}`);
      }
      
      // Si no hay bullets específicos, tomar el contenido completo
      const description = bullets.length > 0 
        ? bullets.join('\n\n') 
        : sectionContent.trim().substring(0, 500);
      
      // Determinar tipo y prioridad basado en el título y notas
      const type = this.inferTypeFromTitle(sectionTitle);
      const priority = this.inferPriorityFromNote(sectionNote, sectionTitle);
      
      // Crear recomendación
      const recommendation = new Recommendation({
        id: 0,
        petId: this.mascota!.id,
        type: type,
        title: sectionTitle,
        description: description,
        priority: priority,
        generationDate: new Date(),
        expirationDate: undefined,
        isCompleted: false,
        completionDate: undefined,
        aiSource: 'n8n-webhook-gpt',
        confidence: 90,
        parameters: JSON.stringify({ section: sectionIndex + 1, note: sectionNote })
      });
      
      recommendations.push(recommendation);
      sectionIndex++;
    }
    
    // Si no se encontraron secciones estructuradas, crear una recomendación general
    if (recommendations.length === 0) {
      const generalRecommendation = new Recommendation({
        id: 0,
        petId: this.mascota!.id,
        type: 'CARE',
        title: 'Recomendaciones Generales de Cuidado',
        description: aiText.substring(0, 1000), // Limitar a 1000 caracteres
        priority: 'MEDIUM',
        generationDate: new Date(),
        expirationDate: undefined,
        isCompleted: false,
        completionDate: undefined,
        aiSource: 'n8n-webhook-gpt',
        confidence: 85,
        parameters: JSON.stringify({ fullText: true })
      });
      
      recommendations.push(generalRecommendation);
    }
    
    return recommendations;
  }

  /**
   * Infiere el tipo de recomendación basado en el título
   */
  private inferTypeFromTitle(title: string): 'NUTRITION' | 'EXERCISE' | 'HEALTH' | 'BEHAVIOR' | 'CARE' | 'VACCINATION' {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('nutrición') || titleLower.includes('peso') || titleLower.includes('alimenta')) {
      return 'NUTRITION';
    } else if (titleLower.includes('ejercicio') || titleLower.includes('actividad') || titleLower.includes('estimulación')) {
      return 'EXERCISE';
    } else if (titleLower.includes('salud') || titleLower.includes('articular') || titleLower.includes('dental') || titleLower.includes('chequeo')) {
      return 'HEALTH';
    } else if (titleLower.includes('vacun')) {
      return 'VACCINATION';
    } else if (titleLower.includes('comportamiento')) {
      return 'BEHAVIOR';
    } else {
      return 'CARE';
    }
  }

  /**
   * Infiere la prioridad basada en notas y título
   */
  private inferPriorityFromNote(note: string, title: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const textToCheck = (note + ' ' + title).toLowerCase();
    
    if (textToCheck.includes('prioridad clave') || textToCheck.includes('crucial') || textToCheck.includes('urgente')) {
      return 'HIGH';
    } else if (textToCheck.includes('importante')) {
      return 'MEDIUM';
    } else {
      return 'MEDIUM';
    }
  }

  /**
   * Recarga las recomendaciones desde el store (ya no es necesario porque usamos signals)
   */
  private reloadRecommendations(): void {
    // No hacer nada - los signals se actualizan automáticamente
    console.log('Recomendaciones actualizadas automáticamente via signals');
  }

  marcarCompletada(recomendacionId: number): void {
    const recomendaciones = this.recomendaciones();
    const index = recomendaciones.findIndex(r => r.id === recomendacionId);
    if (index !== -1) {
      // Crear una nueva instancia de Recommendation con isCompleted actualizado
      const recomendacion = recomendaciones[index];
      const recomendacionActualizada = new Recommendation({
        ...recomendacion,
        id: recomendacion.id,
        petId: recomendacion.petId,
        type: recomendacion.type,
        title: recomendacion.title,
        description: recomendacion.description,
        priority: recomendacion.priority,
        generationDate: recomendacion.generationDate,
        expirationDate: recomendacion.expirationDate,
        isCompleted: true,
        completionDate: new Date(),
        aiSource: recomendacion.aiSource,
        confidence: recomendacion.confidence,
        parameters: recomendacion.parameters
      });
      
      // Actualizar en el store (el signal se actualizará automáticamente)
      this.gestionStore.updateRecomendacion(recomendacionActualizada).subscribe({
        next: () => {
          this.snackBar.open('Recomendación marcada como completada', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error al marcar recomendación como completada:', error);
          this.snackBar.open('Error al actualizar la recomendación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
