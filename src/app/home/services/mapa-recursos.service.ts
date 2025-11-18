import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecursoResponseDto {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface InventarioUbicacionResponseDto {
  ubicacionId: string;
  ubicacionNombre: string;
  recursos: { [tipo: string]: RecursoResponseDto };
}

@Injectable({
  providedIn: 'root',
})
export class MapaRecursosService {
  private apiUrl = '/api/inventario-completo';

  constructor(private http: HttpClient) {}

  obtenerInventarioCompleto(): Observable<InventarioUbicacionResponseDto[]> {
    return this.http.get<InventarioUbicacionResponseDto[]>(this.apiUrl);
  }
}
