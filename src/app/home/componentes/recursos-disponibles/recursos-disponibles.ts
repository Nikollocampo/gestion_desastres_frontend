import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursosService, RecursoDisponible } from '../../pages/services/recursos.service';

@Component({
  selector: 'app-recursos-disponibles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recursos-disponibles.html',
  styleUrl: './recursos-disponibles.css',
})
export class RecursosDisponibles implements OnInit {
  recursos: RecursoDisponible[] = [];
  loading = true;
  error = '';

  // Paginación
  page = 1;
  pageSize = 5;
  get totalPages() {
    return Math.ceil(this.recursos.length / this.pageSize);
  }
  get recursosPaginados() {
    const start = (this.page - 1) * this.pageSize;
    return this.recursos.slice(start, start + this.pageSize);
  }

  constructor(private recursosService: RecursosService) {}

  ngOnInit(): void {
    this.recursosService.listarRecursos().subscribe({
      next: (data) => {
        this.recursos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los recursos disponibles';
        this.loading = false;
      }
    });
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.page + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.page = nuevaPagina;
    }
  }
}
