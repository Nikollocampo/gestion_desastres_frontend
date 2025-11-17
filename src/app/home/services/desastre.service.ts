import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ubicacion {
  id: string;
  nombre: string;
  calle: string;
  carrera: string;
  tipoUbicacion: string;
}

export interface EquipoAsignado {
  idEquipo: string;
  integrantesDisponibles: number;
  tipoEquipo: string;
  ubicacion: Ubicacion;
}

export interface Desastre {
  magnitud: number;
  nombre: string;
  idDesastre: string;
  tipoDesastre: string;
  personasAfectadas: number;
  fecha: number[];
  ubicacion: Ubicacion;
  equiposAsignados: EquipoAsignado[];
}

@Injectable({
  providedIn: 'root',
})
export class DesastreService {
  private apiUrl = 'http://localhost:8080/api/desastres'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Desastre[]> {
    return this.http.get<Desastre[]>(`${this.apiUrl}/get`);
 
  }
}
