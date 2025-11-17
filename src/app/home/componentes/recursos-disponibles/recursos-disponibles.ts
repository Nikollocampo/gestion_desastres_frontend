import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursosService, RecursoDisponible } from '../../services/recursos.service';

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
}
