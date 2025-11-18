import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestionar-evacuaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestionar-evacuaciones.component.html',
  styleUrls: ['./gestionar-evacuaciones.component.css']
})
export class GestionarEvacuacionesComponent {
  @Input() evacuaciones: string[] = [];
}

