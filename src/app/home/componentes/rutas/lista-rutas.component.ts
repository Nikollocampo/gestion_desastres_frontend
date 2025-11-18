import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService, RutaResponseDto } from '../../pages/services/ruta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-rutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.css']
})
export class ListaRutasComponent implements OnInit, OnDestroy {
  rutas: RutaResponseDto[] = [];
  cargando = true;
  error: string | null = null;
  private subs = new Subscription();

  // Paginación
  page = 1;
  pageSize = 5;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.rutas.length / this.pageSize));
  }

  get pagedRutas(): RutaResponseDto[] {
    const start = (this.page - 1) * this.pageSize;
    return this.rutas.slice(start, start + this.pageSize);
  }

  prevPage() { if (this.page > 1) this.page--; }
  nextPage() { if (this.page < this.totalPages) this.page++; }

  constructor(private rutaService: RutaService) {}

  ngOnInit(): void {
    this.cargarRutas();
    const s = this.rutaService.refresh$.subscribe(() => this.cargarRutas());
    this.subs.add(s);
  }

  private cargarRutas() {
    this.rutaService.listar().subscribe({
      next: (data) => {
        this.rutas = data;
        this.cargando = false;
        this.page = 1;
      },
      error: (err) => {
        this.error = 'Error al cargar las rutas';
        this.cargando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
