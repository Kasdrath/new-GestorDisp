import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { empleadoService } from '../../services/empleado.service';
import { dispositivoService } from '../../services/dispositivo.service';

@Component({
  selector: 'app-dialogo-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, SelectModule],
  templateUrl: './dialogoAsignacion.html'
})
export class DialogoAsignacion {
  private _visible: boolean = false;

  @Input()
  get visible(): boolean { return this._visible; }
  set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.cargarDatos(); // Carga datos frescos SOLO cuando el modal se va a abrir
    }
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();

  empleados: any[] = [];
  dispositivos: any[] = [];
  asignacion: any = {};

  constructor(
    private empleadoService: empleadoService,
    private dispositivoService: dispositivoService
  ) {}

  cargarDatos() {
    this.empleadoService.obtenerTodos().subscribe({
      next: (data) => {
        // Filtramos para que solo se puedan seleccionar empleados Activos
        const empleadosActivos = data.filter((e: any) => e.estadoEmpleado !== false);

        this.empleados = empleadosActivos.map((e: any) => ({
          ...e,
          nombreCompleto: `${e.nombresEmpleado} ${e.apellidosEmpleado} (${e.rutEmpleado})`
        }));
      },
      error: (err) => console.error('Error cargando empleados:', err)
    });

    this.dispositivoService.obtenerTodos().subscribe({
      next: (data) => {
        this.dispositivos = data.map((d: any) => ({
          ...d,
          enUso: d.asignaciones && d.asignaciones.some((a: any) => !a.fechaDesvinculacion),
          etiquetaDropdown: `${d.marcaDisp} ${d.modeloDisp} (N/S: ${d.numeroSerie})`
        }));
      },
      error: (err) => console.error('Error cargando dispositivos:', err)
    });
  }

  get dispositivosDisponibles() {
    // Solo mostramos los dispositivos activos y que NO están en uso
    return this.dispositivos.filter(d => d.estadoDisp === true && d.enUso === false);
  }

  cerrar() {
    this.visibleChange.emit(false);
  }

  guardar() {
    this.onSave.emit(this.asignacion);
    this.asignacion = {}; // Limpiamos el formulario
    this.cerrar();
  }
}