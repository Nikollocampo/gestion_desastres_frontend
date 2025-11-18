import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipoService, EquipoRequestDto, EquipoResponseDto } from '../../services/equipo.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UbicacionService, UbicacionResponseDto } from '../../services/ubicacion.service';

@Component({
  selector: 'app-crear-equipo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-equipo.component.html',
  styleUrls: ['./crear-equipo.component.css']
})
export class CrearEquipoComponent implements OnInit {
  equipo = {
    idEquipo: '',
    integrantesDisponibles: 0,
    tipoEquipo: '',
    ubicacionId: ''
  };
  ubicaciones: UbicacionResponseDto[] = [];
  mensaje: string | null = null;
  exito: boolean | null = null;
  loading = false;
  @ViewChild('equipoForm') equipoForm!: NgForm;

  // Nuevo Output para notificar la creación
  static equipoCreadoCallback: (() => void) | null = null;

  constructor(private equipoService: EquipoService, private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.ubicacionService.listar().subscribe({
      next: (data) => this.ubicaciones = data,
      error: () => this.ubicaciones = []
    });
  }

  crearEquipo(form: NgForm) {
    if (form.invalid) return;
    this.loading = true;
    this.mensaje = null;
    const equipoAEnviar = {
      idEquipo: this.equipo.idEquipo,
      integrantesDisponibles: this.equipo.integrantesDisponibles,
      tipoEquipo: this.equipo.tipoEquipo.toUpperCase(),
      ubicacionId: this.equipo.ubicacionId
    };
    this.equipoService.crearEquipo(equipoAEnviar as any).subscribe({
      next: (resp: EquipoResponseDto) => {
        this.mensaje = resp.mensaje || 'Equipo creado correctamente';
        this.exito = resp.exito ?? true;
        this.loading = false;
        form.resetForm();
        // Notificar a la lista de asignar equipo
        if ((window as any).equipoCreadoCallback) {
          (window as any).equipoCreadoCallback();
        }
      },
      error: (err) => {
        this.mensaje = err?.error?.mensaje || 'Error al crear el equipo';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
