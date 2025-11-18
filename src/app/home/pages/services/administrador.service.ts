import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministradorService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  definirRuta(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ruta/definir`, dto);
  }

  asignarEquipo(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipo/asignar`, dto);
  }

  asignarRecursosPrioridad(): Observable<any> {
    return this.http.post(`${this.apiUrl}/recursos/prioridad`, {});
  }

  listarDesastresPorPrioridad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/desastres/prioridad`);
  }

  generarReporte(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reporte`, { responseType: 'blob' });
  }
}
