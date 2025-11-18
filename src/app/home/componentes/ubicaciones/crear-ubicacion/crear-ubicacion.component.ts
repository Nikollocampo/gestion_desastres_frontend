import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UbicacionService, UbicacionRequestDto } from '../../../pages/services/ubicacion.service';

@Component({
  selector: 'app-crear-ubicacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-ubicacion.component.html',
  styleUrls: ['./crear-ubicacion.component.css']
})
export class CrearUbicacionComponent {
  nombre = '';
  calle = '';
  carrera = '';
  tipoUbicacion = '';
  mensaje: string|null = null;
  error: string|null = null;
  cargando = false;

  constructor(private ubicacionService: UbicacionService) {}

  crearUbicacion(form: NgForm) {
    this.mensaje = null;
    this.error = null;
    if (form.invalid) return;
    this.cargando = true;
    const dto: UbicacionRequestDto = {
      nombre: this.nombre,
      calle: this.calle,
      carrera: this.carrera,
      tipoUbicacion: this.tipoUbicacion
    };
    this.ubicacionService.crear(dto).subscribe({
      next: () => {
        this.mensaje = 'Ubicación creada exitosamente';
        this.cargando = false;
        form.resetForm();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Error al crear la ubicación';
        this.cargando = false;
      }
    });
  }
}
