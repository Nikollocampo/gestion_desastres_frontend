import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperadorService {
  private apiUrl = 'http://localhost:8080/api/operadores';

  constructor(private http: HttpClient) {}

  monitorearUbicaciones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/monitorear-ubicaciones`);
  }

  actualizarSituacion(idDesastre: string, personasAfectadas: number, magnitud: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/desastres/${idDesastre}/actualizar`,
      { personasAfectadas, magnitud }
    );
  }

  gestionarEvacuaciones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/gestionar-evacuaciones`);
  }
}

