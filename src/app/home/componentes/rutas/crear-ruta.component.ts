import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';

@Component({
  selector: 'app-crear-ruta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.css']
})
export class CrearRutaComponent {
  origenId: string = '';
  destinoId: string = '';
  distancia: number | null = null;
  mensaje: string | null = null;
  error: string | null = null;
  cargando = false;

  constructor(private rutaService: RutaService) {}

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
      error: () => {
        this.error = 'Error al crear la ruta';
        this.cargando = false;
      }
    });
  }
}
