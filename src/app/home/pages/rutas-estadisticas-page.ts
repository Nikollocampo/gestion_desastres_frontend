import { Component } from '@angular/core';
import { ListaRutasComponent } from '../componentes/rutas/lista-rutas.component';
import { CrearRutaComponent } from '../componentes/rutas/crear-ruta.component';
import { ListaUbicacionesComponent } from '../componentes/ubicaciones/lista-ubicaciones.component';


@Component({
  selector: 'app-rutas-estadisticas-page',
  standalone: true,
  imports: [ListaRutasComponent, CrearRutaComponent, ListaUbicacionesComponent],
  templateUrl: './rutas-estadisticas-page.html',
  styleUrls: ['./rutas-estadisticas-page.css']
})
export class RutasEstadisticasPage {}
