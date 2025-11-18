import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecursosService, RecursoDisponible, Ubicacion } from '../../pages/services/recursos.service';
import { UbicacionService } from '../../pages/services/ubicacion.service';

@Component({
  selector: 'app-crear-recurso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-recurso.component.html',
  styleUrls: ['./crear-recurso.component.css']
})
export class CrearRecursoComponent implements OnInit {
  form!: FormGroup;
  // Sólo los tipos permitidos
  tipos = ['ALIMENTO', 'MEDICAMENTO'];
  submitting = false;
  successMessage = '';
  errorMessage = '';

  // Ubicaciones cargadas desde el servicio de ubicaciones
  ubicaciones: Ubicacion[] = [];
  showNuevaUbicacion = false;
  // Mostrar/ocultar detalles de ubicación a petición del usuario
  showDetallesUbicacion = false;

  constructor(private fb: FormBuilder, private recursosService: RecursosService, private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      ubicacionSeleccionada: [''], // id de la ubicacion existente o 'new'
      ubicacion: this.fb.group({
        id: ['', Validators.required],
        nombre: ['', Validators.required],
        calle: [''],
        carrera: [''],
        tipoUbicacion: ['', Validators.required]
      })
    });

    // Cargar ubicaciones existentes desde el servicio de ubicaciones
    this.ubicacionService.listar().subscribe({
      next: (lista) => {
        this.ubicaciones = (lista || []).map(u => ({ id: u.id, nombre: u.nombre, calle: u.calle, carrera: u.carrera, tipoUbicacion: u.tipoUbicacion }));
      },
      error: () => this.ubicaciones = []
    });

    // Si el usuario cambia la selección, actualizamos el grupo ubicacion
    this.form.get('ubicacionSeleccionada')?.valueChanges.subscribe((val) => this.onSeleccionUbicacion(val));

    // Por defecto ocultamos los detalles y deshabilitamos el grupo para evitar validaciones
    this.showDetallesUbicacion = false;
    this.form.get('ubicacion')?.disable();
  }

  onSeleccionUbicacion(val: string) {
    const ubicGroup = this.form.get('ubicacion') as FormGroup;
    if (!val || val === '') {
      // ninguna seleccion; vaciar y permitir editar si necesita
      this.showNuevaUbicacion = false;
      ubicGroup.reset();
      // mantén el estado de visibilidad: solo habilita si los detalles están visibles
      if (this.showDetallesUbicacion) {
        ubicGroup.enable();
      } else {
        ubicGroup.disable();
      }
      return;
    }

    if (val === 'new') {
      // crear nueva ubicacion
      this.showNuevaUbicacion = true;
      ubicGroup.reset({ id: '', nombre: '', calle: '', carrera: '', tipoUbicacion: '' });
      if (this.showDetallesUbicacion) {
        ubicGroup.enable();
      } else {
        // si detalles no visibles, mantener deshabilitado hasta que el usuario los muestre
        ubicGroup.disable();
      }
      return;
    }

    // seleccionar una ubicacion existente
    this.showNuevaUbicacion = false;
    const found = this.ubicaciones.find(u => u.id === val);
    if (found) {
      ubicGroup.patchValue({ id: found.id, nombre: found.nombre, calle: found.calle, carrera: found.carrera, tipoUbicacion: found.tipoUbicacion });
      // bloquear edición de los campos al usar una ubicación existente
      if (this.showDetallesUbicacion) {
        ubicGroup.disable();
      } else {
        // si detalles ocultos, mantener deshabilitado
        ubicGroup.disable();
      }
    } else {
      // no encontrada: vaciar y permitir editar
      ubicGroup.reset();
      if (this.showDetallesUbicacion) {
        ubicGroup.enable();
      } else {
        ubicGroup.disable();
      }
    }
  }

  toggleDetalles() {
    this.showDetallesUbicacion = !this.showDetallesUbicacion;
    const ubicGroup = this.form.get('ubicacion') as FormGroup;
    if (this.showDetallesUbicacion) {
      // mostrar detalles: habilitar o mantener disabled si fue bloqueado por selección existente
      const sel = this.form.get('ubicacionSeleccionada')?.value;
      if (sel && sel !== 'new') {
        // si hay una ubicación existente, aplicar patch y mantener campos deshabilitados
        const found = this.ubicaciones.find((u) => u.id === sel);
        if (found) {
          ubicGroup.patchValue({ id: found.id, nombre: found.nombre, calle: found.calle, carrera: found.carrera, tipoUbicacion: found.tipoUbicacion });
          ubicGroup.disable();
        } else {
          ubicGroup.enable();
        }
      } else {
        ubicGroup.enable();
      }
    } else {
      // ocultar detalles: deshabilitar para evitar validaciones
      ubicGroup.disable();
    }
  }

  onSubmit(): void {
    // Si el grupo de ubicacion está deshabilitado (usa existente), habilitar temporalmente para obtener valor
    const ubicGroup = this.form.get('ubicacion') as FormGroup;
    let restoredDisabled = false;
    if (ubicGroup.disabled) {
      ubicGroup.enable();
      restoredDisabled = true;
    }

    if (this.form.invalid) {
      // Si está intentando crear una ubicación nueva pero los detalles están ocultos, mostrar detalles para que llene los campos
      const fv2 = this.form.value;
      if (fv2.ubicacionSeleccionada === 'new' && !this.showDetallesUbicacion) {
        this.showDetallesUbicacion = true;
        // volver a ajustar estado del grupo
        ubicGroup.enable();
        return; // mostrar detalles y detener submit para que el usuario complete
      }
      this.form.markAllAsTouched();
      if (restoredDisabled) { ubicGroup.disable(); }
      return;
    }

    this.submitting = true;
    // Construir payload adecuado para el backend
    const fv = this.form.value;
    const selected = fv.ubicacionSeleccionada;
    let ubicacionPayload: any = null;
    if (selected && selected !== 'new') {
      // Buscar la ubicación completa y enviarla
      const found = this.ubicaciones.find(u => u.id === selected);
      if (found) {
        ubicacionPayload = found;
      } else {
        ubicacionPayload = { id: selected };
      }
    } else {
      // Nueva ubicación: enviar los campos completos
      ubicacionPayload = fv.ubicacion;
    }

    const payload: RecursoDisponible = {
      id: fv.id || undefined,
      nombre: fv.nombre,
      tipo: fv.tipo,
      cantidad: fv.cantidad,
      ubicacion: ubicacionPayload
    } as any;

    this.recursosService.crearRecurso(payload).subscribe({
      next: () => {
        this.successMessage = 'Recurso creado correctamente';
        this.errorMessage = '';
        this.form.reset({ cantidad: 0 });
        this.submitting = false;
        // volver a cargar ubicaciones por si se creó una nueva
        this.ubicacionService.listar().subscribe({ next: (lista) => { this.ubicaciones = (lista || []).map(u => ({ id: u.id, nombre: u.nombre, calle: u.calle, carrera: u.carrera, tipoUbicacion: u.tipoUbicacion })); }, error: () => {} });
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error creando recurso';
        this.successMessage = '';
        this.submitting = false;
      }
    });

    if (restoredDisabled) { ubicGroup.disable(); }
  }
}
