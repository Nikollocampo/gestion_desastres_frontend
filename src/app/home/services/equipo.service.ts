import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipo {
  idEquipo: string;
  integrantesDisponibles: number;
  tipoEquipo: string;
  ubicacion: {
    id: string;
    nombre: string;
    calle: string;
    carrera: string;
    tipoUbicacion: string;
  };
}

export interface EquipoRequestDto {
  integrantesDisponibles: number;
  tipoEquipo: string;
  ubicacion: {
    id: string;
    nombre: string;
    calle: string;
    carrera: string;
    tipoUbicacion: string;
  };
}

export interface EquipoResponseDto {
  idEquipo: string;
  integrantesDisponibles: number;
  tipoEquipo: string;
  ubicacion: {
    id: string;
    nombre: string;
    calle: string;
    carrera: string;
    tipoUbicacion: string;
  };
  mensaje?: string;
  exito?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private apiUrl = 'http://localhost:8080/api/equipos';

  constructor(private http: HttpClient) {}

  crearEquipo(dto: EquipoRequestDto): Observable<EquipoResponseDto> {
    return this.http.post<EquipoResponseDto>(`${this.apiUrl}/crear`, dto);
  }

  listar(): Observable<EquipoResponseDto[]> {
    return this.http.get<EquipoResponseDto[]>(`${this.apiUrl}/listar`);
  }
}
