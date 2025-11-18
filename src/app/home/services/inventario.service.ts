import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecursoResponseDto {
  // Define properties according to your backend DTO
}

export interface InventarioUbicacionResponseDto {
  ubicacionId: string;
  nombreUbicacion: string;
  recursos: { [tipo: string]: RecursoResponseDto };
}

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'http://localhost:8080/api/mapa-recursos'; // Ajusta la URL base según tu configuración

  constructor(private http: HttpClient) {}

  obtenerInventarioCompleto(): Observable<InventarioUbicacionResponseDto[]> {
    return this.http.get<InventarioUbicacionResponseDto[]>(`${this.apiUrl}/ubicacion/ubicacionId`);
  }
}
