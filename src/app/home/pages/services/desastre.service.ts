import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

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

export interface DesastreRequestDto {
  idUbicacion: string;
  equiposIds?: string[];
  nombre?: string;
  tipoDesastre?: string;
  magnitud?: number;
  personasAfectadas?: number;
  fecha?: string | number[];
}

@Injectable({
  providedIn: 'root',
})
export class DesastreService {
  private apiUrl = 'http://localhost:8080/api/desastres'; // Ajusta la URL según tu backend
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Desastre[]> {
    return this.http.get<Desastre[]>(`${this.apiUrl}/get`);
  }

  actualizarDesastre(desastre: Desastre): Observable<Desastre> {
    return this.http.put<Desastre>(`${this.apiUrl}/actualizar`, desastre);
  }

  registrarDesastre(dto: DesastreRequestDto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/registrar`, dto)
      .pipe(tap(() => this.refreshSubject.next()));
  }
}
