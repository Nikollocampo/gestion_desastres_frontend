import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestionar-evacuaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestionar-evacuaciones.component.html',
  styleUrls: ['./gestionar-evacuaciones.component.css']
})
export class GestionarEvacuacionesComponent implements OnChanges {
  @Input() evacuaciones: string[] = [];
  page = 1;
  pageSize = 5;

  get tituloLimpio(): string {
    if (!this.evacuaciones || this.evacuaciones.length === 0) return '';
    const crudo = this.evacuaciones[0] || '';
    // Quita signos '=' al inicio/fin y espacios extra
    return crudo.replace(/^=+\s*|\s*=+$/g, '').trim();
  }

  get items(): ParsedEvacuacion[] {
    if (!this.evacuaciones || this.evacuaciones.length <= 1) return [];
    return this.evacuaciones.slice(1).map((s) => this.parseEvacuacion(s)).filter(Boolean) as ParsedEvacuacion[];
  }

  get total(): number {
    return this.items.length;
  }

  get totalPages(): number {
    const t = Math.ceil(this.total / this.pageSize) || 1;
    return Math.max(1, t);
  }

  get paginados(): ParsedEvacuacion[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.items.slice(start, end);
  }

  get startIndex(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.page * this.pageSize;
    return end > this.total ? this.total : end;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Asegura que la página actual sea válida cuando cambia la entrada
    if (changes['evacuaciones']) {
      if (this.page > this.totalPages) this.page = this.totalPages;
      if (this.page < 1) this.page = 1;
    }
  }

  private parseEvacuacion(s: string): ParsedEvacuacion | null {
    if (!s) return null;
    const partes = s.split(' | ').map(p => p.trim());
    const data: any = { desastre: '', zona: '', riesgoZona: '', prioridad: '', personas: null, magnitud: null };

    for (const p of partes) {
      const idx = p.indexOf(':');
      if (idx === -1) continue;
      const k = p.slice(0, idx).replace(/^[-→>\s]+/, '').trim().toLowerCase();
      const v = p.slice(idx + 1).trim();
      if (k.startsWith('evacuando')) data.desastre = v;
      else if (k === 'zona') data.zona = v;
      else if (k.includes('riesgo')) data.riesgoZona = v;
      else if (k.includes('prioridad')) data.prioridad = v;
      else if (k.startsWith('personas')) data.personas = this.toNumber(v);
      else if (k.startsWith('magnitud')) data.magnitud = this.toNumber(v);
    }

    return data as ParsedEvacuacion;
  }

  private toNumber(v: string): number | null {
    const n = Number((v || '').toString().replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }
}

export interface ParsedEvacuacion {
  desastre: string;
  zona: string;
  riesgoZona: string; // Alta | Media | Baja
  prioridad: string;  // Alta | Media | Baja
  personas: number | null;
  magnitud: number | null;
}

