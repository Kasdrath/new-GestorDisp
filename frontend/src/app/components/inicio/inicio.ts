import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelmenuBasicDemo } from '../menupanel/menupanel';
import { TableBasicDemo, Columna, Entidad, Dispositivo, Empleado, Asignacion } from '../tabla/tabla';
import { dispositivoService } from '../../services/dispositivo.service';
import { empleadoService } from '../../services/empleado.service';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Toolbar } from '../toolbar/toolbar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PanelmenuBasicDemo, TableBasicDemo, Toolbar],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  providers: [MessageService]
})
export class Inicio implements OnInit {
  private dispositivoService = inject(dispositivoService);
  private empleadoService = inject(empleadoService);
  private asignacionService = inject(AsignacionesService);
  private messageService = inject(MessageService);

  dispositivos = signal<Dispositivo[]>([]);
  empleados = signal<Empleado[]>([]);
  asignaciones = signal<Asignacion[]>([]);
  mostrarTablaComp = signal(false);
  camposFiltroGlobal = signal<string[]>([]);
  loading = signal(true);
  tipoVistaActual = signal('Devices');

  private columnasBase: Columna[] = [
    { field: 'idDispositivo', header: 'ID', type: 'numeric' },
    { field: 'numeroSerie', header: 'N/S', type: 'text' },
    { field: 'marcaDisp', header: 'Marca', type: 'text' },
    { field: 'modeloDisp', header: 'Modelo', type: 'text' },
    { field: 'fechaCompra', header: 'Fecha Compra', type: 'date' },
    { field: 'estadoDisp', header: 'Estado', type: 'boolean' },
  ];

  // Derivamos las columnas de forma reactiva
  columnas = computed<Columna[]>(() => {
    const vista = this.tipoVistaActual();
    switch (vista) {
      case 'Desktop':
        return [
          ...this.columnasBase,
          { field: 'procesadorComp', header: 'Procesador', type: 'text' },
          { field: 'memoriaComp', header: 'Memoria', type: 'text' },
          { field: 'almacenamientoComp', header: 'Almacenamiento', type: 'text' },
        ];
      case 'Phone':
        return [
          ...this.columnasBase,
          { field: 'companiaTelefono', header: 'Compañia', type: 'text' },
          { field: 'numeroTelefono', header: 'Número', type: 'text' },
        ];
      case 'Empleados':
        return [
          { field: 'idEmpleado', header: 'ID', type: 'numeric' },
          { field: 'nombresEmpleado', header: 'Nombre', type: 'text' },
          { field: 'apellidosEmpleado', header: 'Apellido', type: 'text' },
          { field: 'rutEmpleado', header: 'Rut', type: 'text' },
          { field: 'emailEmpleado', header: 'Email', type: 'text' },
          { field: 'telefonoEmpleado', header: 'Teléfono', type: 'text' },
          { field: 'nacionalidadEmpleado', header: 'Nacionalidad', type: 'text' },
          { field: 'cargoEmpleado', header: 'Cargo', type: 'text' },
          { field: 'estadoEmpleado', header: 'Estado', type: 'boolean' },
        ];
      case 'Asignacion':
        return [
          { field: 'idAsignacion', header: 'ID', type: 'numeric' },
          { field: 'dispositivo.numeroSerie', header: 'N/S Dispositivo', type: 'text' },
          { field: 'empleado.nombresEmpleado', header: 'Nombre Empleado', type: 'text' },
          { field: 'empleado.apellidosEmpleado', header: 'Apellido Empleado', type: 'text' },
          { field: 'fechaAsignacion', header: 'Fecha Asignación', type: 'date' },
          { field: 'fechaDesvinculacion', header: 'Fecha Desvinculación', type: 'date' },
        ];
      case 'Estadisticas':
        return [];
      default:
        return this.columnasBase;
    }
  });

  // Derivamos los datos de forma reactiva sin necesidad de reasignar
  datos = computed<Entidad[]>(() => {
    const vista = this.tipoVistaActual();
    switch (vista) {
      case 'Desktop': return this.dispositivos().filter((d) => d.tipoDispositivo?.idTipoDisp == 1);
      case 'Phone': return this.dispositivos().filter((d) => d.tipoDispositivo?.idTipoDisp == 2);
      case 'Empleados': return this.empleados();
      case 'Asignacion': return this.asignaciones();
      case 'Estadisticas': return this.dispositivos();
      default: return this.dispositivos();
    }
  });

  ngOnInit() {
    this.obtenerDatos();
  }

  obtenerDatos(entidad?: string) {
    this.loading.set(true);

    // Si no se envía entidad, o es explícitamente 'dispositivos', se recargan
    if (!entidad || entidad === 'dispositivos') {
      this.dispositivoService.obtenerTodos().subscribe({
        next: (data: Dispositivo[]) => {
          this.dispositivos.set(data.map(d => ({
            ...d,
            enUso: d.asignaciones?.some(a => !a.fechaDesvinculacion) ?? false
          })));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al obtener dispositivos:', error);
          this.loading.set(false);
        }
      });
    }
    // Si no se envía entidad, o es explícitamente 'empleados', se recargan
    if (!entidad || entidad === 'empleados') {
      this.empleadoService.obtenerTodos().subscribe({
        next: (data: Empleado[]) => {
          this.empleados.set(data.map(e => ({
            ...e,
            estadoEmpleado: e.estadoEmpleado !== false 
          })));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al obtener empleados:', error);
          this.loading.set(false);
        }
      });
    }
    if (!entidad || entidad === 'asignaciones') {
      this.asignacionService.obtenerTodos().subscribe({
        next: (data: Asignacion[]) => {
          this.asignaciones.set(data.map(a => ({
            ...a,
            fechaAsignacion: this.formatearFechaIso(a.fechaAsignacion),
            fechaDesvinculacion: this.formatearFechaIso(a.fechaDesvinculacion)
          })));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al obtener asignaciones:', error);
          this.loading.set(false);
        }
      });
    }
  }

  private formatearFechaIso(fecha: string | null | Date): string | null {
    if (!fecha) return null;
    if (fecha instanceof Date) return fecha.toISOString();
    if (typeof fecha !== 'string') return String(fecha);
    // Transforma "DD-MM-YYYY HH:mm:ss" a "YYYY-MM-DDTHH:mm:ss"
    const partes = fecha.split(' ');
    if (partes.length === 2 && partes[0].includes('-')) {
      const [dia, mes, anio] = partes[0].split('-');
      if (dia && mes && anio && dia.length <= 2 && anio.length === 4) {
        return `${anio}-${mes}-${dia}T${partes[1]}`;
      }
    }
    return fecha;
  }

  cargarTablaDispositivos(deviceType: string) {
    // Al cambiar este signal, los `computed` que dependen de él (`datos` y `columnas`)
    // se recalcularán automáticamente, actualizando la vista.
    this.tipoVistaActual.set(deviceType);
  }

  manejarEliminar(data: Entidad) {
    if ('idDispositivo' in data) {
      if (confirm(`¿Estás seguro de eliminar el dispositivo con número de serie ${data.numeroSerie}?`)) {
        this.dispositivoService.eliminar(data.idDispositivo).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dispositivo eliminado (borrado lógico)', life: 3000 });
            this.obtenerDatos();
          },
          error: (error: any) => console.error('Error al eliminar el dispositivo:', error),
        });
      }
    } else if ('idEmpleado' in data) {
      if (confirm(`¿Estás seguro de eliminar al empleado ${data.nombresEmpleado} ${data.apellidosEmpleado}?`)) {
        this.empleadoService.eliminar(data.idEmpleado).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado eliminado (borrado lógico)', life: 3000 });
            this.obtenerDatos();
          },
          error: (error: any) => console.error('Error al eliminar el empleado:', error),
        });
      }
    } else if ('idAsignacion' in data) {
      if (confirm(`¿Estás seguro de desvincular el dispositivo ${data.dispositivo?.numeroSerie} del empleado ${data.empleado?.nombresEmpleado}?`)) {
        this.asignacionService.eliminar(data.idAsignacion).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dispositivo desvinculado correctamente', life: 3000 });
            this.obtenerDatos();
          },
          error: (error: any) => {
            console.error('Error al desvincular:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al desvincular' });
          },
        });
      }
    }
  }

  manejarReactivar(empleado: Entidad) {
    if (!('idEmpleado' in empleado)) return;
    if (confirm(`¿Estás seguro de reactivar al empleado ${empleado.nombresEmpleado} ${empleado.apellidosEmpleado}?`)) {
      const empleadoActualizado = { ...empleado, estadoEmpleado: true };
      this.empleadoService.actualizar(empleado.idEmpleado, empleadoActualizado as Empleado).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado reactivado', life: 3000 });
          this.obtenerDatos();
        },
        error: (error: any) => {
          console.error('Error al reactivar el empleado:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al reactivar el empleado' });
        },
      });
    }
  }
}
