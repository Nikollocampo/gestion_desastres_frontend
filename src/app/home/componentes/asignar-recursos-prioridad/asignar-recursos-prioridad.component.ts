import { Component, Output, EventEmitter } from '@angular/core';
import { AdministradorService } from '../../services/administrador.service';
import { CommonModule } from '@angular/common';

export interface AsignacionRecurso {
  desastre: string;
  recursos: { tipo: string; cantidad: number; razon?: string }[];
}

@Component({
  selector: 'app-asignar-recursos-prioridad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asignar-recursos-prioridad.component.html',
  styleUrls: ['./asignar-recursos-prioridad.component.css']
})
export class AsignarRecursosPrioridadComponent {
  @Output() asignacionRealizada = new EventEmitter<{mensaje: string|null, exito: boolean|null, asignaciones: AsignacionRecurso[]}>();
  mensaje: string | null = null;
  exito: boolean | null = null;
  loading = false;
  asignaciones: AsignacionRecurso[] = [];

  constructor(private adminService: AdministradorService) {}

  asignarRecursos() {
    this.loading = true;
    this.mensaje = null;
    this.asignaciones = [];
    this.adminService.asignarRecursosPrioridad().subscribe({
      next: (resp) => {
        this.mensaje = resp.mensaje;
        this.exito = resp.exito;
        // Usar directamente la respuesta del backend
        if (Array.isArray(resp)) {
          // Si el backend retorna solo la lista
          this.asignaciones = resp.map((asig: any) => ({
            desastre: asig.desastre,
            recursos: (asig.recursos || []).map((r: any) => ({
              tipo: r.tipo,
              cantidad: r.cantidad,
              razon: r.razon || 'Asignado por prioridad y disponibilidad'
            }))
          }));
        } else if (Array.isArray(resp.asignaciones)) {
          // Si el backend retorna { mensaje, exito, asignaciones }
          this.asignaciones = resp.asignaciones.map((asig: any) => ({
            desastre: asig.desastre,
            recursos: (asig.recursos || []).map((r: any) => ({
              tipo: r.tipo,
              cantidad: r.cantidad,
              razon: r.razon || 'Asignado por prioridad y disponibilidad'
            }))
          }));
        } else {
          this.asignaciones = [];
        }
        this.loading = false;
        this.asignacionRealizada.emit({mensaje: this.mensaje, exito: this.exito, asignaciones: this.asignaciones});
      },
      error: (err) => {
        this.mensaje = err?.error?.mensaje || 'Error al asignar recursos';
        this.exito = false;
        this.loading = false;
        this.asignacionRealizada.emit({mensaje: this.mensaje, exito: this.exito, asignaciones: []});
      }
    });
  }
}
