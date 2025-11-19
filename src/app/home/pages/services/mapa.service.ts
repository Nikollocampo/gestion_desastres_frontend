import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ubicacion {
  id: string;
  nombre: string;
  calle?: string;
  carrera?: string;
  tipoUbicacion?: string;
  lat: number;
  lng: number;
}

export interface PuntoRuta {
  lat: number;
  lng: number;
}

export interface Ruta {
  id: string;
  nombre?: string;
  origenId: string;
  destinoId: string;
  riesgo?: 'ALTO' | 'MEDIO' | 'BAJO';
  puntos: PuntoRuta[];
}

@Injectable({ providedIn: 'root' })
export class MapaService {
  private readonly http = inject(HttpClient);
  // Usamos la misma base que UbicacionService para ir contra tu backend real
  private readonly baseUrl = 'http://localhost:8080/api';

  // Ubicaciones geocodificadas (nodos del mapa)
  getUbicaciones(): Observable<Ubicacion[]> {
    // Suponemos que el backend expone /api/ubicaciones/listar-geocoded
    // Si tu endpoint tiene otro nombre, solo cambia la URL aquí.
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/listar-geocoded`);
  }

  // Rutas predefinidas entre nodos
  getRutasPredefinidas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.baseUrl}/rutas`);
  }

  // Ruta calculada entre dos nodos
  getRutaEntre(origenId: string, destinoId: string): Observable<Ruta> {
    return this.http.get<Ruta>(
      `${this.baseUrl}/rutas/entre?origenId=${encodeURIComponent(origenId)}&destinoId=${encodeURIComponent(destinoId)}`
    );
  }

  // Ruta real entre dos coordenadas usando OSRM
  getRutaRealEntreCoordenadas(origen: { lat: number; lng: number }, destino: { lat: number; lng: number }): Observable<PuntoRuta[]> {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;
    return this.http.get<any>(url).pipe(
      map(resp => {
        if (resp && resp.routes && resp.routes.length > 0) {
          return resp.routes[0].geometry.coordinates.map((c: [number, number]) => ({ lng: c[0], lat: c[1] }));
        }
        return [];
      })
    );
  }
}
