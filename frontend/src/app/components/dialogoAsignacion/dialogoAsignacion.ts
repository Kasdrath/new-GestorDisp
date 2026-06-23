import { ChangeDetectionStrategy, Component, effect, inject, model, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { EmpleadoService } from '../../services/empleado.service';
import { DispositivoService } from '../../services/dispositivo.service';
import { Empleado } from '../../models/empleado';
import { Dispositivo } from '../../models/dispositivo';

// Interfaces para tipado estricto
export interface EmpleadoOpcion {
  idEmpleado: number;
  nombresEmpleado: string;
  apellidosEmpleado: string;
  rutEmpleado: string;
  estadoEmpleado: boolean;
  nombreCompleto?: string;
}

export interface DispositivoOpcion {
  idDispositivo: number;
  numeroSerie: string;
  marcaDisp: string;
  modeloDisp: string;
  estadoDisp: boolean;
  asignaciones?: any[];
  enUso?: boolean;
  etiquetaDropdown?: string;
}

@Component({
  selector: 'app-dialogo-asignacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, SelectModule],
  templateUrl: './dialogoAsignacion.html'
})
export class DialogoAsignacion {
  private empleadoService = inject(EmpleadoService);
  private dispositivoService = inject(DispositivoService);
  private fb = inject(FormBuilder);

  visible = model(false);
  onSave = output<{ idEmpleado?: number; idDispositivo?: number }>();

  empleados = signal<EmpleadoOpcion[]>([]);
  dispositivos = signal<DispositivoOpcion[]>([]);

  form = this.fb.group({
    idEmpleado: [null as number | null, Validators.required],
    idDispositivo: [null as number | null, Validators.required]
  });

  dispositivosDisponibles = computed(() => {
    return this.dispositivos().filter(d => d.estadoDisp === true && d.enUso === false);
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.form.reset();
        this.cargarDatos();
      }
    });
  }

  cargarDatos() {
    this.empleadoService.obtenerTodos().subscribe({
      next: (data: Empleado[]) => {
        const empleadosActivos = data.filter(e => e.estadoEmpleado !== false);
        this.empleados.set(empleadosActivos.map(e => ({
          ...e,
          nombreCompleto: `${e.nombresEmpleado} ${e.apellidosEmpleado} (${e.rutEmpleado})`
        })));
      },
      error: (err) => console.error('Error cargando empleados:', err)
    });

    this.dispositivoService.obtenerTodos().subscribe({
      next: (data: Dispositivo[]) => {
        this.dispositivos.set(data.map(d => ({
          ...d,
          enUso: d.asignaciones && d.asignaciones.some((a) => !a.fechaDesvinculacion),
          etiquetaDropdown: `${d.marcaDisp} ${d.modeloDisp} (N/S: ${d.numeroSerie})`
        })));
      },
      error: (err) => console.error('Error cargando dispositivos:', err)
    });
  }

  cerrar() {
    this.visible.set(false);
  }

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.onSave.emit({
        idEmpleado: formValue.idEmpleado ?? undefined,
        idDispositivo: formValue.idDispositivo ?? undefined
      });
      this.form.reset();
      this.cerrar();
    }
  }
}