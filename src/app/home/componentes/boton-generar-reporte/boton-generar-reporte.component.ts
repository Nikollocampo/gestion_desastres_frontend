import { Component } from '@angular/core';
import { AdministradorService } from '../../pages/services/administrador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boton-generar-reporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-generar-reporte.component.html',
  styleUrls: ['./boton-generar-reporte.component.css']
})
export class BotonGenerarReporteComponent {
  loading = false;
  mensaje: string | null = null;

  constructor(private adminService: AdministradorService) {}

  generarReporte() {
    this.loading = true;
    this.mensaje = null;
    this.adminService.generarReporte().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_desastres.txt';
        a.click();
        window.URL.revokeObjectURL(url);
        this.mensaje = 'Reporte generado y descargado correctamente';
        this.loading = false;
        alert('El reporte se generó y descargó correctamente.\nRuta de descarga: C:/Users/[TU_USUARIO]/Downloads/reporte_desastres.txt');
      },
      error: (err) => {
        this.mensaje = 'Error al generar el reporte';
        this.loading = false;
      }
    });
  }
}
