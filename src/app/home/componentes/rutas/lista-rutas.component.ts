import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService, RutaResponseDto } from '../../services/ruta.service';

@Component({
  selector: 'app-lista-rutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.css']
})
export class ListaRutasComponent implements OnInit {
  rutas: RutaResponseDto[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private rutaService: RutaService) {}

  ngOnInit(): void {
    this.rutaService.listar().subscribe({
      next: (data) => {
        this.rutas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las rutas';
        this.cargando = false;
      }
    });
  }
}
