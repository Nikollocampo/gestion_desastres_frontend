import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monitorear-ubicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitorear-ubicaciones.component.html',
  styleUrls: ['./monitorear-ubicaciones.component.css']
})
export class MonitorearUbicacionesComponent implements OnInit {
  @Input() ubicaciones: string[] = [];

  ngOnInit(): void {}

  // Paginación
  page = 1;
  pageSize = 6;

  get allParsed() {
    return (this.ubicaciones || [])
      .slice(1)
      .map((u) => this.parseUbicacion(u))
      .filter((u) => u.type !== 'none'); // ocultar filas con coordenadas nulas
  }

  get totalPages() {
    const len = this.allParsed.length;
    return Math.max(1, Math.ceil(len / this.pageSize));
  }

  get paginadas() {
    const start = (this.page - 1) * this.pageSize;
    return this.allParsed.slice(start, start + this.pageSize);
  }

  prevPage() { if (this.page > 1) this.page--; }
  nextPage() { if (this.page < this.totalPages) this.page++; }

  private parseUbicacion(texto: string): {
    nombre: string;
    type: 'numeric' | 'text' | 'none';
    x?: string;
    y?: string;
    raw?: string;
  } {
    if (!texto) return { nombre: '', type: 'none' };
    const m = texto.match(/^(.*?)\s*\((.*?)\)\s*$/);
    if (!m) return { nombre: texto, type: 'none' };
    const nombre = m[1].trim();
    const coords = (m[2] || '').trim();
    // Si hay valores nulos, no mostrar coordenadas
    if (!coords || /(^|\b)null(\b|$)/i.test(coords)) return { nombre, type: 'none' };

    // Intentar extraer dos valores numéricos separados por "y", coma o espacios
    const numPair = coords.match(/(-?\d+(?:\.\d+)?)\D+y\D+(-?\d+(?:\.\d+)?)/i)
      || coords.match(/(-?\d+(?:\.\d+)?)[,;\s]+(-?\d+(?:\.\d+)?)/);
    if (numPair) {
      return { nombre, type: 'numeric', x: numPair[1], y: numPair[2] };
    }
    // Si no son números, mostrar el texto de coordenadas tal cual
    return { nombre, type: 'text', raw: coords };
  }
}

