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

  // Pastel por zona (sin dependencias externas)
  pieGradient = '';
  pieLegend: { label: string; value: number; color: string; percent: number }[] = [];
  
  // Pastel por recursos
  pieGradientRecursos = '';
  pieLegendRecursos: { label: string; value: number; color: string; percent: number }[] = [];
  
  private piePalette: string[] = [
    '#5C6BC0', '#42A5F5', '#26A69A', '#9CCC65', '#FFCA28', '#EF5350',
    '#AB47BC', '#8D6E63', '#29B6F6', '#66BB6A', '#FF7043', '#7E57C2', '#26C6DA'
  ];

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
    
    // Cargar recursos creados
    this.recursosService.listarRecursos().subscribe({
      next: (recursos) => {
        console.log('Recursos creados:', recursos);
        this.procesarRecursosCreados(recursos);
      },
      error: (err) => console.error('Error al cargar recursos:', err)
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

  private procesarRecursosCreados(recursos: any[]) {
    const porUbicacion: { [key: string]: number } = {};
    let total = 0;

    // Agrupar recursos por ubicación
    for (const recurso of recursos || []) {
      const ubicacion = recurso.ubicacion?.nombre || 'Sin ubicación';
      const cantidad = Number(recurso.cantidad || 0);

      porUbicacion[ubicacion] = (porUbicacion[ubicacion] || 0) + cantidad;
      total += cantidad;
    }

    this.totalRecursosDistribuidos = total;
    this.totalRecursosDisponibles = total;
    this.porcentajeDistribucionGlobal = 100;

    this.recursosDistribuidos = Object.keys(porUbicacion).map(ubicacion => ({
      producto: ubicacion,
      cantidadTotal: porUbicacion[ubicacion],
      distribuidoPorTipo: [],
      porcentajeDistribuido: 100
    })).sort((a, b) => b.cantidadTotal - a.cantidadTotal);

    this.distribuidosPorUbicacion = [];
    
    // Actualizar gráfico de pastel de recursos
    this.actualizarPieRecursos();
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

    // Actualizar gráfico de pastel por zona
    this.actualizarPiePorZona();
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

  private actualizarPiePorZona() {
    const total = this.evacuaciones.reduce((acc, e) => acc + (e.totalPersonas || 0), 0);
    if (total <= 0) {
      this.pieGradient = '';
      this.pieLegend = [];
      return;
    }

    // Agrupar por zona
    const porZona: { [zona: string]: number } = {};
    for (const e of this.evacuaciones) {
      const zona = (e.zona || 'Sin zona').trim();
      porZona[zona] = (porZona[zona] || 0) + (e.totalPersonas || 0);
    }

    const items = Object.keys(porZona).map((label, idx) => {
      const value = porZona[label];
      const percent = Math.round((value / total) * 100);
      const color = this.piePalette[idx % this.piePalette.length];
      return { label, value, percent, color };
    }).sort((a, b) => b.value - a.value);

    this.pieLegend = items;

    // Construir conic-gradient
    let start = 0;
    const segments: string[] = [];
    for (const it of items) {
      const end = start + (it.value / total) * 100;
      segments.push(`${it.color} ${start}% ${end}%`);
      start = end;
    }
    this.pieGradient = `conic-gradient(${segments.join(', ')})`;
  }

  private actualizarPieRecursos() {
    const total = this.recursosDistribuidos.reduce((acc, r) => acc + (r.cantidadTotal || 0), 0);
    if (total <= 0) {
      this.pieGradientRecursos = '';
      this.pieLegendRecursos = [];
      return;
    }

    const items = this.recursosDistribuidos.map((rec, idx) => {
      const value = rec.cantidadTotal;
      const percent = Math.round((value / total) * 100);
      const color = this.piePalette[idx % this.piePalette.length];
      return { label: rec.producto, value, percent, color };
    }).sort((a, b) => b.value - a.value);

    this.pieLegendRecursos = items;

    // Construir conic-gradient
    let start = 0;
    const segments: string[] = [];
    for (const it of items) {
      const end = start + (it.value / total) * 100;
      segments.push(`${it.color} ${start}% ${end}%`);
      start = end;
    }
    this.pieGradientRecursos = `conic-gradient(${segments.join(', ')})`;
  }
}
