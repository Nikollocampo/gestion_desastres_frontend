import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { BotonGenerarReporteComponent } from '../componentes/boton-generar-reporte/boton-generar-reporte.component';
import { Desastre, DesastreService } from '../services/desastre.service';
import { AsignarEquipoComponent } from '../componentes/asignar-equipo/asignar-equipo.component';
import { CrearEquipoComponent } from '../componentes/crear-equipo/crear-equipo.component';
import { DefinirRutaComponent } from '../componentes/definir-ruta/definir-ruta.component';
import { AsignarRecursosPrioridadComponent, AsignacionRecurso } from '../componentes/asignar-recursos-prioridad/asignar-recursos-prioridad.component';
import { ListaDesastresPrioridadComponent } from '../componentes/lista-desastres-prioridad/lista-desastres-prioridad.component';

@Component({
  selector: 'app-administracion-page',
  standalone: true,
  imports: [
    CommonModule,
    BotonGenerarReporteComponent,
    AsignarEquipoComponent,
    CrearEquipoComponent,
    DefinirRutaComponent,
    AsignarRecursosPrioridadComponent,
    ListaDesastresPrioridadComponent
  ],
  templateUrl: './administracion-page.html',
  styleUrls: ['./administracion-page.css']
})
export class AdministracionPage implements OnInit {
  rol: string | null = null;
  desastres: Desastre[] = [];
  desastreSeleccionado: Desastre | null = null;

  // Para mostrar la salida de asignación de recursos
  resultadoAsignacion: {mensaje: string|null, exito: boolean|null, asignaciones: AsignacionRecurso[]} | null = null;

  constructor(private authService: AuthService, private desastreService: DesastreService) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();
    this.cargarDesastres();
  }

  cargarDesastres() {
    this.desastreService.obtenerTodos().subscribe({
      next: (data) => this.desastres = data,
      error: () => this.desastres = []
    });
  }

  onAsignacionRecursos(resultado: {mensaje: string|null, exito: boolean|null, asignaciones: AsignacionRecurso[]}) {
    this.resultadoAsignacion = resultado;
  }
}
