import { Component, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { MapaService, Ubicacion, Ruta } from './services/mapa.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mapa-interactivo-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa-interactivo-page.html',
  styleUrls: ['./mapa-interactivo-page.css']
})
export class MapaInteractivoPage implements AfterViewInit, OnDestroy {
  private readonly mapaService = inject(MapaService);
  private readonly http = inject(HttpClient);

  map!: L.Map;
  markers: L.Marker[] = [];
  rutasDibujadas: L.Polyline[] = [];

  ubicaciones: Ubicacion[] = [];
  rutas: Ruta[] = [];

  origenId: string | null = null;
  destinoId: string | null = null;

  // Ubicaciones fijas proporcionadas por el usuario
  ubicacionesFijas: Ubicacion[] = [
    { id: "7b958f06-cd4c-4316-81b9-254c92216a07", nombre: "Centro Salud", calle: "Calle 10", carrera: "Carrera 15", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6016075, lng: -74.0720922 },
    { id: "3d347f5d-c7fe-4774-bef3-3679197ff4a1", nombre: "Bienestar Sur", calle: "Calle 30", carrera: "Carrera 12", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6224434, lng: -74.0783228 },
    { id: "1ee23f5f-961c-42a1-9f95-4ffe2571f0c0", nombre: "Salud Integral", calle: "Calle 18", carrera: "Carrera 3", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6152201, lng: -74.0739489 },
    { id: "0b751e16-3bed-4230-86e2-bd75182ab37e", nombre: "Centro Esperanza", calle: "Calle 5", carrera: "Carrera 20", tipoUbicacion: "CENTRO_AYUDA", lat: 4.5893162, lng: -74.0852959 },
    { id: "bc2032a7-017d-457e-8ca6-ab57a2193d35", nombre: "Clinica Sur", calle: "Calle 5", carrera: "Carrera 20", tipoUbicacion: "CENTRO_AYUDA", lat: 4.5893162, lng: -74.0852959 },
    { id: "093a12e2-35df-4178-af4b-b976470c30c1", nombre: "Paracetamol", calle: "Calle 13", carrera: "Carrera 7", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6010757, lng: -74.0706498 },
    { id: "39254f3e-4893-408b-8505-df24c74e844d", nombre: "Colegio San Luis", calle: "Calle 4", carrera: "Carrera 10", tipoUbicacion: "REFUGIO", lat: 4.5854498, lng: -74.0766639 },
    { id: "4f76f80d-1020-4043-9452-c76bdf6fe4fa", nombre: "nikoll", calle: "Calle 73", carrera: "Carrera 42", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6586828, lng: -74.0575563 },
    { id: "28269df0-c729-4e42-862a-6ec847682dc0", nombre: "BARRIO", calle: "Calle 50", carrera: "Carrera 30", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6487289, lng: -74.0682339 },
    { id: "ca54312d-d335-4cec-9605-a1799ec1aa9d", nombre: "laureles", calle: "Calle 73", carrera: "Carrera 42", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6586828, lng: -74.0575563 },
    { id: "b98f1eb4-0410-4c19-a6d4-a58f7509bdb0", nombre: "jhan", calle: "Calle 2", carrera: "Carrera 1", tipoUbicacion: "CENTRO_AYUDA", lat: 4.581684, lng: -74.0677321 },
    { id: "f624219f-1441-4fb9-8d6e-17aaafa7d6c8", nombre: "INCENDIO CASA", calle: "Calle 73", carrera: "Carrera 23", tipoUbicacion: "CENTRO_AYUDA", lat: 4.6540975, lng: -74.0725045 }
  ];

  ngAfterViewInit(): void {
    // Inicialización de Leaflet SOLO aquí, nunca en ngOnInit
    this.inicializarMapa();
    // Esperar a que el mapa esté completamente inicializado antes de dibujar
    setTimeout(() => {
      this.dibujarUbicacionesFijas();
      console.log('Ubicaciones fijas dibujadas, generando rutas entre ubicaciones...');
      // Generar todas las rutas automáticamente
      setTimeout(() => {
        this.generarRutasEntreUbicaciones();
      }, 1000);
    }, 500);

    // Cargar datos del backend (opcional, en paralelo)
    this.cargarUbicaciones();
    this.cargarRutasPredefinidas();

    // Si el mapa está en un panel que aparece después, forzar el resize
    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    // Configuración optimizada del mapa con Leaflet
    this.map = L.map('mapa-interactivo', {
      center: [4.65, -74.05], // Bogotá, Colombia
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      attributionControl: true
    });

    // Usar tiles de OpenStreetMap con configuración optimizada
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      crossOrigin: true
    }).addTo(this.map);

    // Asegurar que el mapa se renderice correctamente después de la inicialización
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  private cargarUbicaciones(): void {
    this.mapaService.getUbicaciones().subscribe({
      next: ubicaciones => {
        console.log('Ubicaciones recibidas en mapa:', ubicaciones);
        this.ubicaciones = ubicaciones;
        this.dibujarMarcadores();
      },
      error: err => {
        console.error('Error obteniendo ubicaciones', err);
      }
    });
  }

  private cargarRutasPredefinidas(): void {
    this.mapaService.getRutasPredefinidas().subscribe({
      next: rutas => {
        console.log('Rutas recibidas en mapa:', rutas);
        this.rutas = rutas;
        this.dibujarRutas(rutas);
      },
      error: err => {
        console.error('Error obteniendo rutas', err);
      }
    });
  }

  private dibujarMarcadores(): void {
    // Limpiar marcadores anteriores
    this.markers.forEach(m => m.remove());
    this.markers = [];

    if (this.ubicaciones.length === 0) return;

    const bounds = L.latLngBounds([]);

    for (const u of this.ubicaciones) {
      // Crear marcador con icono por defecto de Leaflet
      const marker = L.marker([u.lat, u.lng], {
        title: u.nombre
      }).addTo(this.map);

      // Agregar popup con información
      marker.bindPopup(`
        <div style="font-family: Arial, sans-serif;">
          <strong style="font-size: 14px; color: #1976d2;">${u.nombre}</strong><br/>
          ${u.calle ? `<span style="font-size: 12px;">Calle: ${u.calle}</span><br/>` : ''}
          ${u.carrera ? `<span style="font-size: 12px;">Carrera: ${u.carrera}</span>` : ''}
        </div>
      `);

      this.markers.push(marker);
      bounds.extend(marker.getLatLng());
    }

    // Ajustar el mapa para mostrar todas las ubicaciones
    if (this.ubicaciones.length > 0) {
      this.map.fitBounds(bounds.pad(0.2));
    }
  }

  private dibujarRutas(rutas: Ruta[]): void {
    // Limpiar rutas anteriores
    this.rutasDibujadas.forEach(r => r.remove());
    this.rutasDibujadas = [];

    for (const ruta of rutas) {
      if (!ruta.puntos || ruta.puntos.length === 0) continue;

      const latlngs = ruta.puntos.map(p => L.latLng(p.lat, p.lng));

      // Asignar color según nivel de riesgo
      let color = 'green';
      if (ruta.riesgo === 'ALTO') {
        color = '#dc3545'; // Rojo
      } else if (ruta.riesgo === 'MEDIO') {
        color = '#fd7e14'; // Naranja
      } else {
        color = '#28a745'; // Verde
      }

      // Crear polyline con estilos mejorados
      const polyline = L.polyline(latlngs, {
        color: color,
        weight: 5,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo(this.map);

      // Agregar tooltip con información de la ruta
      polyline.bindTooltip(`Riesgo: ${ruta.riesgo}`, {
        permanent: false,
        direction: 'center'
      });

      this.rutasDibujadas.push(polyline);
    }
  }

  // Cambia los selectores para usar solo ubicacionesFijas
  get ubicacionesParaSeleccion(): Ubicacion[] {
    return this.ubicacionesFijas;
  }

  trazarRutaSeleccionada(): void {
    if (!this.origenId || !this.destinoId) return;
    const origen = this.ubicacionesFijas.find(u => u.id === this.origenId);
    const destino = this.ubicacionesFijas.find(u => u.id === this.destinoId);
    if (!origen || !destino) return;
    // Limpiar rutas previas
    this.rutasDibujadas.forEach(r => r.remove());
    this.rutasDibujadas = [];
    // Obtener y dibujar la ruta real
    this.mapaService.getRutaRealEntreCoordenadas(origen, destino).subscribe(puntos => {
      if (puntos.length > 0) {
        const latlngs = puntos.map(p => L.latLng(p.lat, p.lng));
        const polyline = L.polyline(latlngs, {
          color: '#007bff', // Azul para rutas reales
          weight: 5,
          opacity: 0.8
        }).addTo(this.map);
        polyline.bindTooltip(`${origen.nombre} → ${destino.nombre}`, {
          permanent: false,
          direction: 'center'
        });
        this.rutasDibujadas.push(polyline);
        // Ajustar el mapa a la ruta
        this.map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
      }
    });
  }

  buscarUbicacion(termino: string): void {
    if (!termino) return;

    // Geocodificar usando Nominatim
    this.http.get<any>(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: termino,
        format: 'json',
        limit: '5'
      }
    }).subscribe({
      next: resultados => {
        console.log('Resultados de búsqueda:', resultados);
        this.ubicaciones = resultados.map((r: any) => ({
          id: r.place_id,
          nombre: r.display_name,
          lat: r.lat,
          lng: r.lon,
          calle: r.address?.road || '',
          carrera: r.address?.pedestrian || ''
        }));
        this.dibujarMarcadores();
      },
      error: err => {
        console.error('Error en la búsqueda de ubicación', err);
      }
    });
  }

  private dibujarUbicacionesFijas(): void {
    if (!this.map || this.ubicacionesFijas.length === 0) return;

    console.log('Dibujando ubicaciones fijas:', this.ubicacionesFijas.length);
    const bounds = L.latLngBounds([]);

    for (const u of this.ubicacionesFijas) {
      // Icono especial para CENTRO_AYUDA y REFUGIO
      let icon = L.icon({
        iconUrl: u.tipoUbicacion === 'REFUGIO' ? 'https://cdn-icons-png.flaticon.com/512/190/190411.png' : 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([u.lat, u.lng], {
        title: u.nombre,
        icon: icon
      }).addTo(this.map);

      marker.bindPopup(`
        <div style="font-family: Arial, sans-serif;">
          <strong style="font-size: 14px; color: #1976d2;">${u.nombre}</strong><br/>
          ${u.calle ? `<span style="font-size: 12px;">Calle: ${u.calle}</span><br/>` : ''}
          ${u.carrera ? `<span style="font-size: 12px;">Carrera: ${u.carrera}</span><br/>` : ''}
          <span style="font-size: 12px;">Tipo: ${u.tipoUbicacion || ''}</span>
        </div>
      `);

      this.markers.push(marker);
      bounds.extend([u.lat, u.lng]);
    }

    // Ajustar el mapa para mostrar todas las ubicaciones fijas
    if (this.ubicacionesFijas.length > 0) {
      this.map.fitBounds(bounds.pad(0.1));
      console.log('Mapa ajustado a las ubicaciones fijas');
    }
  }

  private generarRutasEntreUbicaciones(): void {
    if (!this.map || this.ubicacionesFijas.length < 2) {
      console.log('No se pueden generar rutas: mapa no inicializado o pocas ubicaciones');
      return;
    }

    console.log('Generando rutas entre ubicaciones...');
    let rutasGeneradas = 0;
    const totalRutas = (this.ubicacionesFijas.length * (this.ubicacionesFijas.length - 1)) / 2;

    // Generar rutas entre cada par de ubicaciones
    for (let i = 0; i < this.ubicacionesFijas.length; i++) {
      for (let j = i + 1; j < this.ubicacionesFijas.length; j++) {
        const origen = this.ubicacionesFijas[i];
        const destino = this.ubicacionesFijas[j];

        console.log(`Generando ruta ${rutasGeneradas + 1}/${totalRutas}: ${origen.nombre} -> ${destino.nombre}`);

        this.mapaService.getRutaRealEntreCoordenadas(origen, destino).subscribe({
          next: puntos => {
            if (puntos.length > 0) {
              const latlngs = puntos.map(p => L.latLng(p.lat, p.lng));

              // Colores diferentes según el tipo de conexión
              let color = '#007bff'; // Azul por defecto
              let dashArray = '8, 8';
              let weight = 3;

              // Si conecta con refugio, usar verde y línea más gruesa
              if (origen.tipoUbicacion === 'REFUGIO' || destino.tipoUbicacion === 'REFUGIO') {
                color = '#28a745'; // Verde
                dashArray = '5, 5';
                weight = 4;
              }

              const polyline = L.polyline(latlngs, {
                color: color,
                weight: weight,
                opacity: 0.8,
                dashArray: dashArray
              }).addTo(this.map);

              polyline.bindTooltip(`${origen.nombre} ↔ ${destino.nombre}`, {
                permanent: false,
                direction: 'center'
              });

              this.rutasDibujadas.push(polyline);
              rutasGeneradas++;
              console.log(`Ruta generada exitosamente (${rutasGeneradas}/${totalRutas})`);
            } else {
              console.warn(`No se encontraron puntos para la ruta ${origen.nombre} -> ${destino.nombre}`);
            }
          },
          error: err => {
            console.error(`Error generando ruta ${origen.nombre} -> ${destino.nombre}:`, err);
          }
        });
      }
    }
  }

  // Método de prueba para verificar que OSRM funciona
  private probarRutaOSRM(): void {
    console.log('Probando conexión con OSRM...');

    // Tomar las dos primeras ubicaciones para hacer una prueba
    if (this.ubicacionesFijas.length >= 2) {
      const origen = this.ubicacionesFijas[0];
      const destino = this.ubicacionesFijas[1];

      console.log(`Probando ruta entre ${origen.nombre} y ${destino.nombre}`);

      this.mapaService.getRutaRealEntreCoordenadas(origen, destino).subscribe({
        next: puntos => {
          console.log('✅ OSRM funciona correctamente. Puntos recibidos:', puntos.length);
          if (puntos.length > 0) {
            const latlngs = puntos.map(p => L.latLng(p.lat, p.lng));
            const polyline = L.polyline(latlngs, {
              color: '#ff0000',
              weight: 5,
              opacity: 1
            }).addTo(this.map);

            polyline.bindTooltip(`PRUEBA: ${origen.nombre} → ${destino.nombre}`, {
              permanent: true,
              direction: 'center'
            });

            this.rutasDibujadas.push(polyline);

            // Después de la prueba exitosa, generar todas las rutas
            setTimeout(() => {
              this.generarRutasEntreUbicaciones();
            }, 2000);
          }
        },
        error: err => {
          console.error('❌ Error con OSRM:', err);
        }
      });
    }
  }

  generarTodasLasRutas(): void {
    this.limpiarRutas();
    this.generarRutasEntreUbicaciones();
  }

  limpiarRutas(): void {
    // Limpiar solo las rutas, no los marcadores
    this.rutasDibujadas.forEach(r => r.remove());
    this.rutasDibujadas = [];
  }

  generarRutasOptimas(): void {
    this.limpiarRutas();
    // Generar rutas solo desde centros de ayuda hacia el refugio
    const refugio = this.ubicacionesFijas.find(u => u.tipoUbicacion === 'REFUGIO');
    if (!refugio) return;

    const centrosAyuda = this.ubicacionesFijas.filter(u => u.tipoUbicacion === 'CENTRO_AYUDA');

    centrosAyuda.forEach(centro => {
      this.mapaService.getRutaRealEntreCoordenadas(centro, refugio).subscribe(puntos => {
        if (puntos.length > 0) {
          const latlngs = puntos.map(p => L.latLng(p.lat, p.lng));
          const polyline = L.polyline(latlngs, {
            color: '#28a745', // Verde para rutas óptimas
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 5'
          }).addTo(this.map);
          polyline.bindTooltip(`${centro.nombre} → ${refugio.nombre}`, {
            permanent: false,
            direction: 'center'
          });
          this.rutasDibujadas.push(polyline);
        }
      });
    });
  }
}
