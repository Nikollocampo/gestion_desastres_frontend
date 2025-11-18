import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { BotonGenerarReporteComponent } from '../componentes/boton-generar-reporte/boton-generar-reporte.component';
import { Desastre, DesastreService } from './services/desastre.service';
import { AsignarEquipoComponent } from '../componentes/asignar-equipo/asignar-equipo.component';
import { CrearEquipoComponent } from '../componentes/crear-equipo/crear-equipo.component';
import { DefinirRutaComponent } from '../componentes/definir-ruta/definir-ruta.component';
import { AsignarRecursosPrioridadComponent, AsignacionRecurso } from '../componentes/asignar-recursos-prioridad/asignar-recursos-prioridad.component';
import { ListaDesastresPrioridadComponent } from '../componentes/lista-desastres-prioridad/lista-desastres-prioridad.component';
import { MonitorearUbicacionesComponent } from '../componentes/monitorear-ubicaciones/monitorear-ubicaciones.component';
import { OperadorService } from './services/operador.service';
import { ActualizarSituacionDesastreComponent, DesastreActualizar } from '../componentes/actualizar-situacion-desastre/actualizar-situacion-desastre.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenarPorPrioridadPipe } from '../pipes/ordenar-por-prioridad.pipe';
import { GestionarEvacuacionesComponent } from '../componentes/gestionar-evacuaciones/gestionar-evacuaciones.component';
import { CrearRecursoComponent } from '../componentes/crear-recurso/crear-recurso.component';

@Component({
  selector: 'app-administracion-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BotonGenerarReporteComponent,
    AsignarEquipoComponent,
    CrearEquipoComponent,
    DefinirRutaComponent,
    AsignarRecursosPrioridadComponent,
    ListaDesastresPrioridadComponent,
    MonitorearUbicacionesComponent,
    ActualizarSituacionDesastreComponent,
    OrdenarPorPrioridadPipe,
    GestionarEvacuacionesComponent,
    CrearRecursoComponent
  ],
  templateUrl: './administracion-page.html',
  styleUrls: ['./administracion-page.css']
})
export class AdministracionPage implements OnInit {
  rol: string | null = null;
  desastres: Desastre[] = [];
  desastreSeleccionado: Desastre | null = null;
  ubicacionesMonitoreo: string[] = [];
  evacuaciones: string[] = [];

  // Para mostrar la salida de asignación de recursos
  resultadoAsignacion: {mensaje: string|null, exito: boolean|null, asignaciones: AsignacionRecurso[]} | null = null;
  desastresActualizar: DesastreActualizar[] = [];
  mensajeActualizacion: string|null = null;
  // Paginación para resultado de asignaciones
  page = 1;
  pageSize = 4;

  constructor(
    private authService: AuthService,
    private desastreService: DesastreService,
    private operadorService: OperadorService
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();
    this.cargarDesastres();
    if (this.rol === 'OPERADOR_EMERGENCIA') {
      this.cargarUbicacionesMonitoreo();
      this.cargarDesastresActualizar();
      this.cargarEvacuaciones();
    }
  }

  cargarDesastres() {
    this.desastreService.obtenerTodos().subscribe({
      next: (data) => this.desastres = data,
      error: () => this.desastres = []
    });
  }

  cargarUbicacionesMonitoreo() {
    this.operadorService.monitorearUbicaciones().subscribe({
      next: (data) => this.ubicacionesMonitoreo = data,
      error: () => this.ubicacionesMonitoreo = []
    });
  }

  cargarDesastresActualizar() {
    this.desastreService.obtenerTodos().subscribe({
      next: (data) => {
        this.desastresActualizar = (data || []).map((d: any) => ({
          idDesastre: d.idDesastre,
          nombre: d.nombre,
          personasAfectadas: d.personasAfectadas,
          magnitud: d.magnitud
        }));
      },
      error: () => this.desastresActualizar = []
    });
  }

  cargarEvacuaciones() {
    this.operadorService.gestionarEvacuaciones().subscribe({
      next: (data) => this.evacuaciones = data,
      error: () => this.evacuaciones = ['No hay evacuaciones para mostrar.']
    });
  }

  onAsignacionRecursos(resultado: {mensaje: string|null, exito: boolean|null, asignaciones: AsignacionRecurso[]}) {
    this.resultadoAsignacion = resultado;
    this.page = 1; // reiniciar a la primera página en cada nueva asignación
  }

  onActualizarSituacion(payload: { idDesastre: string, personasAfectadas: number, magnitud: number }) {
    this.operadorService.actualizarSituacion(payload.idDesastre, payload.personasAfectadas, payload.magnitud).subscribe({
      next: (resp) => this.mensajeActualizacion = resp.mensaje,
      error: () => this.mensajeActualizacion = 'Error al actualizar la situación.'
    });
  }

  // Helpers de paginación para la vista
  get totalAsignaciones(): number {
    return this.resultadoAsignacion?.asignaciones?.length ?? 0;
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalAsignaciones / this.pageSize));
  }
  get startIndex(): number {
    return (this.page - 1) * this.pageSize;
  }
  get endIndex(): number {
    return this.startIndex + this.pageSize;
  }
  goToPage(n: number) {
    if (this.totalPages === 0) return;
    this.page = Math.min(this.totalPages, Math.max(1, n));
  }
  prevPage() { this.goToPage(this.page - 1); }
  nextPage() { this.goToPage(this.page + 1); }
}
