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

@Component({
  templateUrl: './tabla.html',
  standalone: true,
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
  @Output() datosActualizados = new EventEmitter<void>();
  loading: boolean = true;
  visible: boolean = false;
  dataSelected: any = {};
  visibleEmpleado: boolean = false;

  constructor(
    private dispositivoService: dispositivoService,
    private empleadoService: empleadoService,
  ) {}

  get camposFiltroDinamico(): string[] {
    if (this.camposFiltroGlobal && this.camposFiltroGlobal.length > 0) {
      return this.camposFiltroGlobal;
    }
    return this.columnas.map((col) => col.field);
  }

  ngOnInit() {
    this.loading = false;
  }

  abrirDialogo() {
    this.dataSelected = {};
    this.visible = true;
  }

  visibleChange(event: boolean) {
    this.visible = event;
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(estado: boolean) {
    return estado ? 'success' : 'danger';
  }

  editarDatos(data: any) {
    if ('idDispositivo' in data) {
      // Lógica si el rowData es un dispositivo
      this.dataSelected = { ...data };
      if (this.dataSelected.fechaCompra) {
        const [year, month, day] = String(this.dataSelected.fechaCompra).split('-').map(Number);
        this.dataSelected.fechaCompra = new Date(year, month - 1, day);
      }
      this.visible = true;
      console.log('Es un dispositivo');
    } else if ('idEmpleado' in data) {
      // Lógica si el rowData es un empleado
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
            this.datosActualizados.emit();
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
            this.datosActualizados.emit();
          },
          error: (error) => console.error('Error al eliminar el empleado:', error),
        });
      }
    }
  }

  /* editarDispositivo(dispositivo: any) {
    this.dispositivoSeleccionado = { ...dispositivo };

    if (this.dispositivoSeleccionado.fechaCompra) {
      const [year, month, day] = String(this.dispositivoSeleccionado.fechaCompra)
        .split('-')
        .map(Number);
      this.dispositivoSeleccionado.fechaCompra = new Date(year, month - 1, day);
    }
    this.visible = true;
  }*/

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
          this.datosActualizados.emit();
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
            this.datosActualizados.emit();
          },
          error: (error) => {
            console.error('Error al actualizar el dispositivo:', error);
          },
        });
    } else {
      this.dispositivoService.crear(dispositivoGuardado).subscribe({
        next: (response) => {
          console.log('Dispositivo creado:', response);
          this.datosActualizados.emit();
        },
        error: (error) => {
          console.error('Error al crear el dispositivo:', error);
        },
      });
    }
  }
}
