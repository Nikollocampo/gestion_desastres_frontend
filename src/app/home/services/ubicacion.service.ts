import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UbicacionRequestDto {
  nombre: string;
  calle: string;
  carrera: string;
  tipoUbicacion: string;
}

export interface UbicacionResponseDto {
  id: string;
  nombre: string;
  calle: string;
  carrera: string;
  tipoUbicacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  private apiUrl = 'http://localhost:8080/api/ubicaciones';

  constructor(private http: HttpClient) {}

  crear(dto: UbicacionRequestDto): Observable<UbicacionResponseDto> {
    return this.http.post<UbicacionResponseDto>(`${this.apiUrl}/crear`, dto);
  }

  listar(): Observable<UbicacionResponseDto[]> {
    return this.http.get<UbicacionResponseDto[]>(`${this.apiUrl}/listar`);
  }

  obtenerPorId(id: string): Observable<UbicacionResponseDto> {
    return this.http.get<UbicacionResponseDto>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: string, dto: UbicacionRequestDto): Observable<UbicacionResponseDto> {
    return this.http.put<UbicacionResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

