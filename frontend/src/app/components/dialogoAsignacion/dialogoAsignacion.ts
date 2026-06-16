import { ChangeDetectionStrategy, Component, effect, inject, model, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { empleadoService } from '../../services/empleado.service';
import { dispositivoService } from '../../services/dispositivo.service';

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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, SelectModule],
  templateUrl: './dialogoAsignacion.html'
})
export class DialogoAsignacion {
  private empleadoService = inject(empleadoService);
  private dispositivoService = inject(dispositivoService);

  visible = model(false);
  onSave = output<any>();

  empleados = signal<EmpleadoOpcion[]>([]);
  dispositivos = signal<DispositivoOpcion[]>([]);
  asignacion: any = {}; // Se mantiene como objeto plano para no romper el [(ngModel)]

  dispositivosDisponibles = computed(() => {
    return this.dispositivos().filter(d => d.estadoDisp === true && d.enUso === false);
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.cargarDatos();
      }
    });
  }

  cargarDatos() {
    this.empleadoService.obtenerTodos().subscribe({
      next: (data: any[]) => {
        const empleadosActivos = data.filter(e => e.estadoEmpleado !== false);
        this.empleados.set(empleadosActivos.map(e => ({
          ...e,
          nombreCompleto: `${e.nombresEmpleado} ${e.apellidosEmpleado} (${e.rutEmpleado})`
        })));
      },
      error: (err) => console.error('Error cargando empleados:', err)
    });

    this.dispositivoService.obtenerTodos().subscribe({
      next: (data: any[]) => {
        this.dispositivos.set(data.map(d => ({
          ...d,
          enUso: d.asignaciones && d.asignaciones.some((a: any) => !a.fechaDesvinculacion),
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
    this.onSave.emit({ ...this.asignacion });
    this.asignacion = {}; // Limpiamos el formulario
    this.cerrar();
  }
}