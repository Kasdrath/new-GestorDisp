import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogoDispositivo } from '../dialogoDispositivo/dialogoDispositivo';
import { DialogoEmpleado } from '../dialogoEmpleado/dialogoEmpleado';
import { dispositivoService } from '../../services/dispositivo.service';
import { empleadoService } from '../../services/empleado.service';
import { AsignacionesService } from '../../services/asignaciones.service';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './tabla.html',
  selector: 'app-table-demo',
  imports: [
    TableModule,
    CommonModule,
    FormsModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    TagModule,
    InputTextModule,
    Button,
    DialogModule,
    DialogoDispositivo,
    DialogoEmpleado,
  ],
})
export class TableBasicDemo implements OnInit {
  @Input() datos: any[] = [];
  @Input() columnas: any[] = [];
  @Input() camposFiltroGlobal: string[] = [];
  @Output() datosActualizados = new EventEmitter<string>();
  @Input() loading: boolean = false;
  visible: boolean = false;
  dataSelected: any = {};
  visibleEmpleado: boolean = false;

  constructor(
    private dispositivoService: dispositivoService,
    private empleadoService: empleadoService,
    private asignacionService: AsignacionesService,
    private messageService: MessageService
  ) {}

  get camposFiltroDinamico(): string[] {
    if (this.camposFiltroGlobal && this.camposFiltroGlobal.length > 0) {
      return this.camposFiltroGlobal;
    }
    return this.columnas.map((col) => col.field);
  }

  ngOnInit() {
  }

  abrirDialogo() {
    this.dataSelected = {};
    this.visible = true;
  }

  visibleChange(event: boolean) {
    this.visible = event;
  }

  visibleEmpleadoChange(event: boolean) {
    this.visibleEmpleado = event;
  }

  getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return null;
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(estado: boolean, field: string = 'estadoDisp') {
    if (field === 'enUso') {
      return estado ? 'info' : 'success'; // info (azul) si está asignado, success (verde) si está disponible
    }
    return estado ? 'success' : 'danger';
  }

  editarDatos(data: any) {
    if ('idDispositivo' in data) {
      this.dataSelected = { ...data };
      if (this.dataSelected.fechaCompra) {
        const [year, month, day] = String(this.dataSelected.fechaCompra).split('-').map(Number);
        this.dataSelected.fechaCompra = new Date(year, month - 1, day);
      }
      this.visible = true;
      console.log('Es un dispositivo');
    } else if ('idEmpleado' in data) {
      this.dataSelected = { ...data };
      this.visibleEmpleado = true;
      console.log('Es un empleado');
    }
  }

  eliminarDatos(data: any) {
    if ('idDispositivo' in data) {
      if (
        confirm(`¿Estás seguro de eliminar el dispositivo con número de serie ${data.numeroSerie}?`)
      ) {
        this.dispositivoService.eliminar(data.idDispositivo).subscribe({
          next: () => {
            console.log('Dispositivo eliminado correctamente');
            this.datos = this.datos.filter((d) => d.idDispositivo !== data.idDispositivo);
            this.datosActualizados.emit('dispositivos');
          },
          error: (error) => console.error('Error al eliminar el dispositivo:', error),
        });
      }
    } else if ('idEmpleado' in data) {
      if (
        confirm(
          `¿Estás seguro de eliminar al empleado ${data.nombresEmpleado} ${data.apellidosEmpleado}?`,
        )
      ) {
        this.empleadoService.eliminar(data.idEmpleado).subscribe({
          next: () => {
            console.log('Empleado eliminado correctamente');
            this.datos = this.datos.filter((e) => e.idEmpleado !== data.idEmpleado);
            this.datosActualizados.emit('empleados');
          },
          error: (error) => console.error('Error al eliminar el empleado:', error),
        });
      }
    } else if ('idAsignacion' in data) {
      if (
        confirm(
          `¿Estás seguro de desvincular el dispositivo ${data.dispositivo?.numeroSerie} del empleado ${data.empleado?.nombresEmpleado}?`
        )
      ) {
        this.asignacionService.eliminar(data.idAsignacion).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dispositivo desvinculado correctamente', life: 3000 });
            this.datosActualizados.emit(''); // Refresca todas las tablas para actualizar los estados
          },
          error: (error) => {
            console.error('Error al desvincular:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al desvincular' });
          },
        });
      }
    }
  }

  reactivarEmpleado(empleado: any) {
    if (
      confirm(`¿Estás seguro de reactivar al empleado ${empleado.nombresEmpleado} ${empleado.apellidosEmpleado}?`)
    ) {
      const empleadoActualizado = { ...empleado, estadoEmpleado: true };
      this.empleadoService.actualizar(empleado.idEmpleado, empleadoActualizado).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado reactivado correctamente', life: 3000 });
          this.datosActualizados.emit('empleados');
        },
        error: (error) => {
          console.error('Error al reactivar el empleado:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al reactivar el empleado' });
        },
      });
    }
  }

  eliminarDispositivo(dispositivo: any) {
    if (
      confirm(
        `¿Estás seguro de eliminar el dispositivo con número de serie ${dispositivo.numeroSerie}?`,
      )
    ) {
      this.dispositivoService.eliminar(dispositivo.idDispositivo).subscribe({
        next: () => {
          console.log('Dispositivo eliminado correctamente');
          this.datos = this.datos.filter((d) => d.idDispositivo !== dispositivo.idDispositivo);
          this.datosActualizados.emit('dispositivos');
        },
        error: (error) => {
          console.error('Error al eliminar el dispositivo:', error);
        },
      });
    }
  }

  guardarDispositivo(dispositivoGuardado: any) {
    if (dispositivoGuardado.idDispositivo) {
      this.dispositivoService
        .actualizar(dispositivoGuardado.idDispositivo, dispositivoGuardado)
        .subscribe({
          next: (response) => {
            console.log('Dispositivo actualizado:', response);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dispositivo actualizado correctamente', life: 3000 });
            this.datosActualizados.emit('dispositivos');
          },
          error: (error) => {
            console.error('Error al actualizar el dispositivo:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al actualizar el dispositivo' });
          },
        });
    } else {
      this.dispositivoService.crear(dispositivoGuardado).subscribe({
        next: (response) => {
          console.log('Dispositivo creado:', response);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dispositivo agregado correctamente', life: 3000 });
          this.datosActualizados.emit('dispositivos');
        },
        error: (error) => {
          console.error('Error al crear el dispositivo:', error);
        },
      });
    }
  }

  guardarEmpleado(empleadoGuardado: any) {
    if (empleadoGuardado.idEmpleado) {
      this.empleadoService.actualizar(empleadoGuardado.idEmpleado, empleadoGuardado).subscribe({
        next: (response) => {
          console.log('Empleado actualizado:', response);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado actualizado correctamente', life: 3000 });
          this.datosActualizados.emit('empleados');
        },
        error: (error) => {
          console.error('Error al actualizar el empleado:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al actualizar el empleado. Verifica que el RUT no esté duplicado.' });
        },
      });
    }
  }
}
