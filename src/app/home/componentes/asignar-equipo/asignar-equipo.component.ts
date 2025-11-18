import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AdministradorService } from '../../pages/services/administrador.service';
import { DesastreService, Desastre } from '../../pages/services/desastre.service';
import { EquipoService, Equipo } from '../../pages/services/equipo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asignar-equipo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asignar-equipo.component.html',
  styleUrls: ['./asignar-equipo.component.css']
})
export class AsignarEquipoComponent implements OnInit {
  desastres: Desastre[] = [];
  equipos: Equipo[] = [];
  selectedDesastreId: string = '';
  selectedEquipoId: string = '';
  resultado: any = null;
  mensaje: string | null = null;
  loading = false;

  @Output() equipoAsignado = new EventEmitter<any>();

  constructor(
    private adminService: AdministradorService,
    private desastreService: DesastreService,
    private equipoService: EquipoService
  ) {}

  ngOnInit(): void {
    // Suscribirse al callback de creación de equipo
    (window as any).equipoCreadoCallback = () => {
      this.cargarEquipos();
    };
    this.cargarDesastres();
    this.cargarEquipos();
  }

  cargarDesastres() {
    this.desastreService.obtenerTodos().subscribe({
      next: (data) => this.desastres = data,
      error: () => this.desastres = []
    });
  }

  cargarEquipos() {
    this.equipoService.listar().subscribe({
      next: (data) => this.equipos = data,
      error: () => this.equipos = []
    });
  }

  asignarEquipo() {
    if (!this.selectedDesastreId || !this.selectedEquipoId) {
      this.mensaje = 'Selecciona un desastre y un equipo';
      return;
    }
    this.loading = true;
    this.mensaje = null;
    this.resultado = null;
    this.adminService.asignarEquipo({
      desastreId: this.selectedDesastreId,
      equipoId: this.selectedEquipoId
    }).subscribe({
      next: (resp) => {
        this.resultado = resp;
        this.mensaje = resp.mensaje;
        this.loading = false;
        this.equipoAsignado.emit(resp);
      },
      error: () => {
        this.mensaje = 'Error al asignar equipo';
        this.loading = false;
      }
    });
  }
}
