import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbicacionService, UbicacionResponseDto } from '../../services/ubicacion.service';

@Component({
  selector: 'app-lista-ubicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-ubicaciones.component.html',
  styleUrls: ['./lista-ubicaciones.component.css']
})
export class ListaUbicacionesComponent implements OnInit {
  ubicaciones: UbicacionResponseDto[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.ubicacionService.listar().subscribe({
      next: (data) => {
        this.ubicaciones = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar las ubicaciones';
        this.cargando = false;
      }
    });
  }
}
