import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DesastrePrioridad {
  nombre: string;
  prioridad?: number;
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
}

