import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFmt',
  standalone: true,
})
export class FechaFmtPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    // Caso array [yyyy, mm, dd]
    if (Array.isArray(value) && value.length === 3) {
      const [y, m, d] = value.map(Number);
      return this.formatParts(y, m, d);
    }

    // Caso objeto {year, month, day} (LocalDate estilo Java)
    if (typeof value === 'object' && 'year' in value && 'month' in value && 'day' in value) {
      const y = Number(value.year);
      const m = Number(value.month);
      const d = Number(value.day);
      return this.formatParts(y, m, d);
    }

    // Caso string ISO '2025-11-17' o '2025/11/17'
    if (typeof value === 'string') {
      const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      if (match) {
        return this.formatParts(Number(match[1]), Number(match[2]), Number(match[3]));
      }
    }

    return '';
  }

  private formatParts(year: number, month: number, day: number): string {
    if (!(year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31)) return '';
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  }
}