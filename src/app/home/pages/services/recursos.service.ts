// src/app/home/pages/services/recursos.service.ts
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

export interface RecursoDisponible {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  ubicacion: Ubicacion;
}

@Injectable({
  providedIn: 'root',
})
export class RecursosService {
  private apiUrl = 'http://localhost:8080/api/recurso'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  listarRecursos(): Observable<RecursoDisponible[]> {
    return this.http.get<RecursoDisponible[]>(`${this.apiUrl}/listar`);
  }

  crearRecurso(recurso: RecursoDisponible): Observable<RecursoDisponible> {
    return this.http.post<RecursoDisponible>(`${this.apiUrl}/crear`, recurso);
  }

  actualizarRecurso(id: string, recurso: RecursoDisponible): Observable<RecursoDisponible> {
    return this.http.put<RecursoDisponible>(`${this.apiUrl}/actualizar/${id}`, recurso);
  }
}

