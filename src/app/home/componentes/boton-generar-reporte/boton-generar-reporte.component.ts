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
        // Intentar leer el mensaje del backend si viene como texto
        if (blob.type === 'application/json') {
          // Si el backend retorna un JSON con mensaje, leerlo
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const res = JSON.parse(reader.result as string);
              this.mensaje = res.mensaje || 'Reporte generado';
              // Mostrar mensaje emergente si el backend lo envía
              if (res.mensaje && res.mensaje.includes('Descargas') || res.mensaje.includes('Downloads')) {
                alert(res.mensaje);
              }
            } catch {
              this.mensaje = 'Reporte generado';
            }
            this.loading = false;
          };
          reader.readAsText(blob);
          return;
        }
        // Si es un archivo, descargarlo y mostrar mensaje estándar
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_desastres.txt';
        a.click();
        window.URL.revokeObjectURL(url);
        this.mensaje = 'Reporte generado en carpeta Descargas';
        this.loading = false;
        // Intentar obtener el usuario de Windows desde el backend o dejar la ruta genérica
        let usuario = '';
        try {
          // @ts-ignore
          usuario = window?.navigator?.userAgentData?.platform || '';
        } catch {}
        // Como no se puede obtener el usuario real desde el frontend por seguridad, se deja la ruta genérica
        alert('El reporte se descargó correctamente en la carpeta Descargas.\nRuta: C:/Users/tu_usuario/Downloads/reporte_desastres.txt');
      },
      error: (err) => {
        this.mensaje = 'Error al generar el reporte';
        this.loading = false;
      }
    });
  }
}
