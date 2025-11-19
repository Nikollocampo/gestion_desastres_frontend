import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursosService, RecursoDisponible } from './services/recursos.service';
import { OperadorService } from './services/operador.service';
import { AdministradorService } from './services/administrador.service';

interface EstadisticaRecursoDistribuido {
  producto: string;
  cantidadTotal: number;
  distribuidoPorTipo: { tipo: string; cantidad: number; desastre: string }[];
  porcentajeDistribuido: number;
}

interface EstadisticaEvacuacion {
  zona: string;
  totalPersonas: number;
  prioridad: string;
  estado: string; // completada, en progreso, pendiente
  porcentajeAvance: number;
}

@Component({
  selector: 'app-reportes-estadisticas-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-estadisticas-page.html',
  styleUrls: ['./reportes-estadisticas-page.css']
})
export class ReportesEstadisticasPage implements OnInit {
  cargando = true;

  // Recursos distribuidos
  recursosDistribuidos: EstadisticaRecursoDistribuido[] = [];
  totalRecursosDistribuidos = 0;
  totalRecursosDisponibles = 0;
  porcentajeDistribucionGlobal = 0;

  // Evacuaciones
  evacuaciones: EstadisticaEvacuacion[] = [];
  totalPersonasEvacuadas = 0;
  evacuacionesCompletadas = 0;
  evacuacionesEnProgreso = 0;
  evacuacionesPendientes = 0;
  porcentajeAvanceGlobal = 0;

  // Gráficos
  distribuidosPorUbicacion: { nombre: string; cantidad: number; porcentaje: number }[] = [];
  evacuacionesPorPrioridad: { prioridad: string; cantidad: number; porcentaje: number }[] = [];

  constructor(
    private recursosService: RecursosService,
    private operadorService: OperadorService,
    private adminService: AdministradorService
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  private cargarEstadisticas() {
    this.cargando = true;
    
    // Cargar recursos distribuidos desde desastres con prioridad
    this.adminService.listarDesastresPorPrioridad().subscribe({
      next: (desastres) => {
        console.log('Desastres recibidos:', desastres);
        this.procesarRecursosDistribuidos(desastres);
      },
      error: (err) => console.error('Error al cargar desastres:', err)
    });

    // Cargar evacuaciones
    this.operadorService.gestionarEvacuaciones().subscribe({
      next: (evacuaciones) => {
        this.procesarEvacuaciones(evacuaciones);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar evacuaciones:', err);
        this.cargando = false;
      }
    });
  }

  private procesarRecursosDistribuidos(desastres: any[]) {
    const porProducto: { [key: string]: { total: number; distribuido: number; porTipo: { tipo: string; cantidad: number; desastre: string }[] } } = {};
    let totalDistribuido = 0;
    const porZona: { [key: string]: number } = {};

    // Procesar desastres que tienen recursos asignados
    for (const desastre of desastres || []) {
      const nombreDesastre = desastre.zona || desastre.nombre || desastre.tipo || 'Sin nombre';
      const recursos = desastre.recursos || [];
      
      for (const recurso of recursos) {
        const nombre = recurso.tipo || recurso.nombre || 'Recurso';
        const cantidad = Number(recurso.cantidad || 0);

        if (!porProducto[nombre]) {
          porProducto[nombre] = { total: 0, distribuido: 0, porTipo: [] };
        }

        porProducto[nombre].total += cantidad;
        porProducto[nombre].distribuido += cantidad;
        porProducto[nombre].porTipo.push({
          tipo: nombreDesastre,
          cantidad: cantidad,
          desastre: nombreDesastre
        });

        totalDistribuido += cantidad;
        
        // Agrupar por zona/desastre
        porZona[nombreDesastre] = (porZona[nombreDesastre] || 0) + cantidad;
      }
    }

    this.totalRecursosDistribuidos = totalDistribuido;
    this.totalRecursosDisponibles = totalDistribuido; // En este contexto, solo mostramos lo distribuido
    this.porcentajeDistribucionGlobal = 100; // Todo lo listado está distribuido

    this.recursosDistribuidos = Object.keys(porProducto).map(nombre => ({
      producto: nombre,
      cantidadTotal: porProducto[nombre].total,
      distribuidoPorTipo: porProducto[nombre].porTipo,
      porcentajeDistribuido: 100 // Los recursos asignados están 100% distribuidos
    })).sort((a, b) => b.cantidadTotal - a.cantidadTotal);

    // Agrupar por zona para gráfico
    this.distribuidosPorUbicacion = Object.keys(porZona).map(nombre => {
      const cantidad = porZona[nombre];
      return {
        nombre,
        cantidad,
        porcentaje: totalDistribuido > 0 ? Math.round((cantidad / totalDistribuido) * 100) : 0
      };
    }).sort((a, b) => b.cantidad - a.cantidad);
  }

  private procesarEvacuaciones(evacuaciones: string[]) {
    let totalPersonas = 0;
    let completadas = 0;
    let enProgreso = 0;
    let pendientes = 0;
    const porPrioridad: { [key: string]: number } = {};

    // El primer elemento es el título, los demás son datos
    const datos = (evacuaciones || []).slice(1);

    this.evacuaciones = datos.map(s => {
      const parsed = this.parseEvacuacion(s);
      if (!parsed) return null;

      const personas = Number(parsed.personas || 0);
      const prioridad = (parsed.prioridad || 'Sin dato').toString().trim();
      const zona = (parsed.zona || 'Sin zona').toString().trim();
      
      // Estimar estado basado en magnitud
      const magnitud = Number(parsed.magnitud || 0);
      let estado = 'pendiente';
      let avance = 0;
      
      if (magnitud > 7) {
        estado = 'completada';
        avance = 100;
        completadas++;
      } else if (magnitud > 4) {
        estado = 'en progreso';
        avance = Math.round((magnitud / 10) * 100);
        enProgreso++;
      } else {
        pendientes++;
      }

      totalPersonas += personas;
      porPrioridad[prioridad] = (porPrioridad[prioridad] || 0) + personas;

      return {
        zona,
        totalPersonas: personas,
        prioridad,
        estado,
        porcentajeAvance: avance
      };
    }).filter(Boolean) as EstadisticaEvacuacion[];

    this.totalPersonasEvacuadas = totalPersonas;
    this.evacuacionesCompletadas = completadas;
    this.evacuacionesEnProgreso = enProgreso;
    this.evacuacionesPendientes = pendientes;

    const totalEvac = this.evacuaciones.length;
    this.porcentajeAvanceGlobal = totalEvac > 0 
      ? Math.round((completadas / totalEvac) * 100) 
      : 0;

    this.evacuacionesPorPrioridad = Object.keys(porPrioridad).map(prioridad => {
      const cantidad = porPrioridad[prioridad];
      return {
        prioridad,
        cantidad,
        porcentaje: totalPersonas > 0 ? Math.round((cantidad / totalPersonas) * 100) : 0
      };
    }).sort((a, b) => {
      const orden = ['Alta', 'Media', 'Baja'];
      const ia = orden.indexOf(a.prioridad);
      const ib = orden.indexOf(b.prioridad);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  }

  private parseEvacuacion(s: string): any {
    if (!s) return null;
    const partes = s.split(' | ').map(p => p.trim());
    const data: any = { desastre: '', zona: '', riesgoZona: '', prioridad: '', personas: null, magnitud: null };

    for (const p of partes) {
      const idx = p.indexOf(':');
      if (idx === -1) continue;
      const k = p.slice(0, idx).replace(/^[-→>\s]+/, '').trim().toLowerCase();
      const v = p.slice(idx + 1).trim();
      if (k.startsWith('evacuando')) data.desastre = v;
      else if (k === 'zona') data.zona = v;
      else if (k.includes('riesgo')) data.riesgoZona = v;
      else if (k.includes('prioridad')) data.prioridad = v;
      else if (k.startsWith('personas')) data.personas = this.toNumber(v);
      else if (k.startsWith('magnitud')) data.magnitud = this.toNumber(v);
    }

    return data;
  }

  private toNumber(v: string): number | null {
    const n = Number((v || '').toString().replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'completada': return '#81c784';
      case 'en progreso': return '#ffd54f';
      case 'pendiente': return '#e57373';
      default: return '#90a4ae';
    }
  }

  getPrioridadColor(prioridad: string): string {
    switch (prioridad.toLowerCase()) {
      case 'alta': return '#e57373';
      case 'media': return '#ffd54f';
      case 'baja': return '#81c784';
      default: return '#90a4ae';
    }
  }

  getBarHeight(valor: number, max: number): number {
    return max > 0 ? Math.max((valor / max) * 150, 8) : 8;
  }

  refrescar() {
    this.cargarEstadisticas();
  }
}
