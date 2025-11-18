import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DesastreService, DesastreRequestDto } from '../../pages/services/desastre.service';
import { UbicacionService, UbicacionResponseDto } from '../../pages/services/ubicacion.service';

@Component({
  selector: 'app-registrar-desastre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-desastre.component.html',
  styleUrls: ['./registrar-desastre.component.css']
})
export class RegistrarDesastreComponent implements OnInit {
  // Form fields
  idDesastre: string = '';
  idUbicacion: string = '';
  nombre: string = '';
  tipoDesastre: string = '';
  magnitud: number | null = null;
  personasAfectadas: number | null = null;
  fecha: string = '';

  // UI state
  cargando = false;
  mensaje: string | null = null;
  error: string | null = null;

  // Data sources
  ubicaciones: UbicacionResponseDto[] = [];

  constructor(
    private desastreService: DesastreService,
    private ubicacionService: UbicacionService
  ) {}

  ngOnInit(): void {
    this.cargarUbicaciones();
    // Refrescar ubicaciones si se crean desde otro componente
    this.ubicacionService.refresh$.subscribe(() => this.cargarUbicaciones());
    // Refrescar lista si este componente registra
    this.desastreService.refresh$.subscribe(() => {
      // Hook para otras vistas que escuchen refresh$ (lista, etc.)
    });
  }

  private cargarUbicaciones() {
    this.ubicacionService.listar().subscribe({
      next: (data) => (this.ubicaciones = data || []),
      error: () => (this.ubicaciones = [])
    });
  }

  registrar(form: NgForm) {
    this.mensaje = null;
    this.error = null;
    if (form.invalid) return;
    this.cargando = true;

    const dto: DesastreRequestDto = {
      idDesastre: this.idDesastre || undefined,
      idUbicacion: this.idUbicacion,
      nombre: this.nombre || undefined,
      tipoDesastre: this.tipoDesastre || undefined,
      magnitud: this.magnitud !== null ? this.magnitud : undefined,
      personasAfectadas: this.personasAfectadas !== null ? this.personasAfectadas : undefined,
      fecha: this.fecha || undefined
    };

    this.desastreService.registrarDesastre(dto).subscribe({
      next: () => {
        this.mensaje = 'Desastre registrado exitosamente';
        this.cargando = false;
        form.resetForm();
      },
      error: (err) => {
        if (err && err.error) {
          if (typeof err.error === 'string') {
            try {
              const parsed = JSON.parse(err.error);
              this.error = parsed?.error || err.error;
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
          this.error = 'Error al registrar el desastre';
        }
        this.cargando = false;
      }
    });
  }
}
