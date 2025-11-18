import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { UbicacionService, UbicacionResponseDto } from '../../services/ubicacion.service';

@Component({
  selector: 'app-crear-ruta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.css']
})

export class CrearRutaComponent implements OnInit {
  origenId: string = '';
  destinoId: string = '';
  distancia: number | null = null;
  mensaje: string | null = null;
  error: string | null = null;
  cargando = false;
  ubicaciones: UbicacionResponseDto[] = [];

  constructor(private rutaService: RutaService, private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.ubicacionService.listar().subscribe({
      next: (data) => {
        this.ubicaciones = data;
      },
      error: () => {
        this.ubicaciones = [];
      }
    });
  }

  crearRuta() {
    this.mensaje = null;
    this.error = null;
    this.cargando = true;
    if (this.distancia === null) {
      this.error = 'La distancia es obligatoria';
      this.cargando = false;
      return;
    }
    this.rutaService.crear({
      origenId: this.origenId,
      destinoId: this.destinoId,
      distancia: this.distancia
    }).subscribe({
      next: () => {
        this.mensaje = 'Ruta creada exitosamente';
        this.cargando = false;
        this.origenId = '';
        this.destinoId = '';
        this.distancia = null;
      },
      error: (err) => {
        if (err && err.error) {
          if (typeof err.error === 'string') {
            try {
              const parsed = JSON.parse(err.error);
              if (parsed && parsed.error) {
                this.error = parsed.error;
              } else {
                this.error = err.error;
              }
            } catch {
              this.error = err.error;
            }
          } else if (err.error.message) {
            this.error = err.error.message;
          } else if (err.error.error) {
            this.error = err.error.error;
          } else {
            this.error = JSON.stringify(err.error);
          }
        } else {
          this.error = 'Error al crear la ruta';
        }
        this.cargando = false;
      }
    });
  }
}
