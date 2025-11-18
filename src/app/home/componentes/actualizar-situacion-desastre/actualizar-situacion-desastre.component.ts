import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DesastreActualizar {
  idDesastre: string;
  nombre: string;
  personasAfectadas: number;
  magnitud: number;
}

@Component({
  selector: 'app-actualizar-situacion-desastre',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf],
  templateUrl: './actualizar-situacion-desastre.component.html',
  styleUrls: ['./actualizar-situacion-desastre.component.css']
})
export class ActualizarSituacionDesastreComponent {
  @Input() desastres: DesastreActualizar[] = [];
  @Output() actualizar = new EventEmitter<{ idDesastre: string, personasAfectadas: number, magnitud: number }>();

  selectedId: string = '';
  personasAfectadas: number|null = null;
  magnitud: number|null = null;

  seleccionarDesastre(id: string) {
    this.selectedId = id;
    const d = this.desastres.find(x => x.idDesastre === id);
    this.personasAfectadas = d?.personasAfectadas ?? null;
    this.magnitud = d?.magnitud ?? null;
  }

  enviarActualizacion() {
    if (this.selectedId && this.personasAfectadas != null && this.magnitud != null) {
      this.actualizar.emit({
        idDesastre: this.selectedId,
        personasAfectadas: this.personasAfectadas,
        magnitud: this.magnitud
      });
    }
  }
}
