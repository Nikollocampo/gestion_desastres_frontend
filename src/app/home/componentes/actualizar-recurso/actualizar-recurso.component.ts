import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecursosService, RecursoDisponible, Ubicacion } from '../../pages/services/recursos.service';
import { UbicacionService } from '../../pages/services/ubicacion.service';

@Component({
  selector: 'app-actualizar-recurso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actualizar-recurso.component.html',
  styleUrls: ['./actualizar-recurso.component.css']
})
export class ActualizarRecursoComponent implements OnInit {
  form!: FormGroup;
  recursos: RecursoDisponible[] = [];
  ubicaciones: Ubicacion[] = [];
  tipos = ['ALIMENTO', 'MEDICAMENTO'];
  selectedResourceId: string | null = null;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  showDetallesUbicacion = false;

  constructor(private fb: FormBuilder, private recursosService: RecursosService, private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      ubicacionSeleccionada: ['', Validators.required],
      ubicacion: this.fb.group({
        id: [''],
        nombre: [''],
        calle: [''],
        carrera: [''],
        tipoUbicacion: ['']
      })
    });

    this.cargarRecursos();
    this.ubicacionService.listar().subscribe({ next: (lista) => this.ubicaciones = lista || [], error: () => this.ubicaciones = [] });

    this.form.get('ubicacionSeleccionada')?.valueChanges.subscribe(val => this.onSeleccionUbicacion(val));
  }

  cargarRecursos() {
    this.recursosService.listarRecursos().subscribe({ next: (r) => this.recursos = r || [], error: () => this.recursos = [] });
  }

  onSeleccionRecurso(id: string) {
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedResourceId = id;
    const found = this.recursos.find(r => r.id === id);
    if (found) {
      this.form.patchValue({ nombre: found.nombre, tipo: found.tipo, cantidad: found.cantidad });
      if (found.ubicacion) {
        this.form.patchValue({ ubicacionSeleccionada: found.ubicacion.id });
        this.form.get('ubicacion')?.patchValue(found.ubicacion);
        // default oculto
        this.showDetallesUbicacion = false;
      }
    } else {
      this.form.reset({ cantidad: 0 });
      this.selectedResourceId = null;
    }
  }

  onSeleccionUbicacion(val: string) {
    const ubicGroup = this.form.get('ubicacion') as FormGroup;
    if (!val || val === '') {
      ubicGroup.reset();
      return;
    }
    const found = this.ubicaciones.find(u => u.id === val);
    if (found) {
      ubicGroup.patchValue(found);
    } else {
      ubicGroup.reset();
    }
  }

  toggleDetalles() {
    this.showDetallesUbicacion = !this.showDetallesUbicacion;
  }

  onSubmit() {
    if (!this.selectedResourceId) {
      this.errorMessage = 'Seleccione primero el recurso a actualizar.';
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const fv = this.form.value;
    // construir payload similar a RecursoDisponible
    const payload: RecursoDisponible = {
      id: this.selectedResourceId,
      nombre: fv.nombre,
      tipo: fv.tipo,
      cantidad: fv.cantidad,
      ubicacion: fv.ubicacionSeleccionada ? (this.ubicaciones.find(u => u.id === fv.ubicacionSeleccionada) || fv.ubicacion) : fv.ubicacion
    } as any;

    this.recursosService.actualizarRecurso(this.selectedResourceId, payload).subscribe({
      next: (resp) => {
        this.successMessage = 'Recurso actualizado correctamente.';
        this.errorMessage = '';
        this.submitting = false;
        this.cargarRecursos();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al actualizar recurso.';
        this.successMessage = '';
        this.submitting = false;
      }
    });
  }
}

