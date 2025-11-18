import { Component, OnInit } from '@angular/core';
import { AdministradorService } from '../../pages/services/administrador.service';
import { UbicacionService, UbicacionResponseDto } from '../../pages/services/ubicacion.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-definir-ruta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './definir-ruta.component.html',
  styleUrls: ['./definir-ruta.component.css']
})
export class DefinirRutaComponent implements OnInit {
  ubicaciones: UbicacionResponseDto[] = [];
  origenId: string = '';
  destinoId: string = '';
  resultado: any = null;
  mensaje: string | null = null;
  loading = false;

  constructor(
    private adminService: AdministradorService,
    private ubicacionService: UbicacionService
  ) {}

  ngOnInit(): void {
    this.ubicacionService.listar().subscribe({
      next: (data) => this.ubicaciones = data,
      error: () => this.ubicaciones = []
    });
  }

  definirRuta(form: NgForm) {
    if (!this.origenId || !this.destinoId || this.origenId === this.destinoId) {
      this.mensaje = 'Selecciona origen y destino diferentes';
      return;
    }
    this.loading = true;
    this.mensaje = null;
    this.resultado = null;
    this.adminService.definirRuta({ origenId: this.origenId, destinoId: this.destinoId }).subscribe({
      next: (resp) => {
        this.resultado = resp;
        this.mensaje = resp.mensaje;
        this.loading = false;
      },
      error: (err) => {
        this.mensaje = err?.error?.mensaje || 'Error al definir la ruta';
        this.loading = false;
      }
    });
  }
}

