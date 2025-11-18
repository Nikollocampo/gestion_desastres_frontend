import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { BotonGenerarReporteComponent } from '../componentes/boton-generar-reporte/boton-generar-reporte.component';
import { Desastre, DesastreService } from '../services/desastre.service';
import { AsignarEquipoComponent } from '../componentes/asignar-equipo/asignar-equipo.component';

@Component({
  selector: 'app-administracion-page',
  standalone: true,
  imports: [BotonGenerarReporteComponent, AsignarEquipoComponent],
  templateUrl: './administracion-page.html',
  styleUrls: ['./administracion-page.css']
})
export class AdministracionPage implements OnInit {
  rol: string | null = null;
  desastres: Desastre[] = [];
  desastreSeleccionado: Desastre | null = null;

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

  seleccionarDesastre(desastre: Desastre) {
    // Se clona para evitar modificar la lista hasta guardar
    this.desastreSeleccionado = JSON.parse(JSON.stringify(desastre));
  }

  onDesastreActualizado() {
    this.cargarDesastres();
    this.desastreSeleccionado = null;
  }
}
