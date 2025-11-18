import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesastreService, Desastre } from '../../pages/services/desastre.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFmt',
  standalone: true,
})
export class FechaFmtPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    if (Array.isArray(value) && value.length === 3) {
      const [y, m, d] = value.map(Number);
      return this.formatParts(y, m, d);
    }
    if (typeof value === 'object' && 'year' in value && 'month' in value && 'day' in value) {
      const y = Number(value.year);
      const m = Number(value.month);
      const d = Number(value.day);
      return this.formatParts(y, m, d);
    }
    if (typeof value === 'string') {
      const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      if (match) {
        return this.formatParts(Number(match[1]), Number(match[2]), Number(match[3]));
      }
    }
    return '';
  }
  private formatParts(year: number, month: number, day: number): string {
    if (!(year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31)) return '';
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  }
}

@Component({
  selector: 'app-zonas-afectadas',
  standalone: true,
  imports: [CommonModule, FechaFmtPipe],
  templateUrl: './zonas-afectadas.html',
  styleUrl: './zonas-afectadas.css',
})
export class ZonasAfectadas implements OnInit {
  desastres: Desastre[] = [];
  cargando = true;
  error: string | null = null;
  modalVisible = false;
  selectedDesastre: Desastre | null = null;

  // Paginación
  page = 1;
  pageSize = 5;
  get totalPages() {
    return Math.ceil(this.desastres.length / this.pageSize);
  }
  get desastresPaginados() {
    const start = (this.page - 1) * this.pageSize;
    return this.desastres.slice(start, start + this.pageSize);
  }

  constructor(private desastreService: DesastreService) {}

  ngOnInit() {
    this.desastreService.obtenerTodos().subscribe({
      next: (data) => {
        this.desastres = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos';
        this.cargando = false;
      }
    });
  }

  openModal(desastre: Desastre) {
    this.selectedDesastre = desastre;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedDesastre = null;
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.page + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.page = nuevaPagina;
    }
  }
  // Se usa el pipe fechaFmt para formatear fechas de distintas representaciones.
}
