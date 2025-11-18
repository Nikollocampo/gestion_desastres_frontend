import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DesastrePrioridad {
  nombre: string;
  prioridad?: string; // 'Alta' | 'Media' | 'Baja'
  personasAfectadas?: number;
  recursos?: { tipo: string; cantidad: number }[];
}

@Component({
  selector: 'app-lista-desastres-prioridad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-desastres-prioridad.component.html',
  styleUrls: ['./lista-desastres-prioridad.component.css']
})
export class ListaDesastresPrioridadComponent {
  @Input() desastres: DesastrePrioridad[] = [];

  prioridadClase(p?: string): string {
    if (!p) return '';
    const v = p.toLowerCase();
    if (v.includes('alta')) return 'alta';
    if (v.includes('media')) return 'media';
    if (v.includes('baja')) return 'baja';
    return '';
  }
}

