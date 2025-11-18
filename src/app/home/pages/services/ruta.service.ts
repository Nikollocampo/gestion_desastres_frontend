import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UbicacionResponseDto {
  id: string;
  nombre: string;
  // Puedes agregar más campos según tu modelo real
}

export interface RutaRequestDto {
  origenId: string;
  destinoId: string;
  distancia: number;
}

export interface RutaResponseDto {
  id: string;
  origen: UbicacionResponseDto;
  destino: UbicacionResponseDto;
  distancia: number;
  peso: number;
}

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  private apiUrl = 'http://localhost:8080/api/rutas';

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  crear(dto: RutaRequestDto): Observable<RutaResponseDto> {
    return this.http.post<RutaResponseDto>(`${this.apiUrl}/crear`, dto)
      .pipe(tap(() => this.refreshSubject.next()));
  }

  listar(): Observable<RutaResponseDto[]> {
    return this.http.get<RutaResponseDto[]>(`${this.apiUrl}/listar`);
  }
}
