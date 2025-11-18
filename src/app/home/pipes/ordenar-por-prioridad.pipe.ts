import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarPorPrioridad',
  standalone: true
})
export class OrdenarPorPrioridadPipe implements PipeTransform {
  private prioridadValor(p: string): number {
    if (!p) return 0;
    const val = p.toLowerCase();
    if (val.includes('alta')) return 3;
    if (val.includes('media')) return 2;
    if (val.includes('baja')) return 1;
    return 0;
  }

  transform(desastres: any[]): any[] {
    if (!Array.isArray(desastres)) return [];
    return [...desastres].sort((a, b) => {
      const pa = this.prioridadValor(a.prioridad);
      const pb = this.prioridadValor(b.prioridad);
      return pb - pa;
    });
  }
}

