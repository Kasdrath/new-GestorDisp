import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule, } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HistorialAsignaciones } from '../historialAsignaciones/historialAsignaciones';
import { DashboardEstadisticas, EstadisticasData } from '../dashboardEstadisticas/dashboardEstadisticas';

// Interfaces para un tipado estricto (Regla: Evitar 'any')
export interface Columna {
  field: string;
  header: string;
  type: 'numeric' | 'text' | 'date' | 'boolean';
}

export interface Dispositivo {
  idDispositivo: number;
  numeroSerie: string;
  marcaDisp: string;
  modeloDisp: string;
  fechaCompra: Date | string;
  estadoDisp: boolean;
  enUso?: boolean;
  tipoDispositivo?: { idTipoDisp: number; tipoDispositivo: string };
  asignaciones?: Asignacion[];

  tamanoPantalla?: string;
  procesadorComp?: string;
  memoriaComp?: string;
  almacenamientoComp?: string;
  companiaTelefono?: string;
  numeroTelefono?: string;
}

export interface Empleado {
  idEmpleado: number;
  nombresEmpleado: string;
  apellidosEmpleado: string;
  rutEmpleado: string;
  estadoEmpleado: boolean;
  emailEmpleado?: string;
  telefonoEmpleado?: string;
  nacionalidadEmpleado?: string;
  cargoEmpleado?: string;
}

export interface Asignacion {
  idAsignacion: number;
  dispositivo?: Partial<Dispositivo>;
  empleado?: Partial<Empleado>;
  fechaAsignacion: string | null;
  fechaDesvinculacion: string | null;
}

export type Entidad = Dispositivo | Empleado | Asignacion;

@Component({
  selector: 'app-table-demo',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  templateUrl: './tabla.html',
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
    HistorialAsignaciones,
    DashboardEstadisticas,
  ],
})
export class TableBasicDemo {
 
  datos = input<Entidad[]>([]);
  columnas = input<Columna[]>([]);
  camposFiltroGlobal = input<string[]>([]);
  loading = input(false);
  empleados = input<Empleado[]>([]);

  // Regla: Usar output() en lugar de @Output
  datosActualizados = output<void>();
  onEliminar = output<Entidad>();
  onReactivar = output<Entidad>();
  onEdit = output<Entidad>();

  // Regla: Usar signals para el estado local
  entidadHistorial = signal<Entidad | null>(null);
  mostrarInactivos = signal(false);
  detallesSeleccionados = signal<Partial<Entidad>>({});

  detallesDispositivo = computed(() => {
    const d = this.detallesSeleccionados();
    return d && 'idDispositivo' in d ? d as Partial<Dispositivo> : null;
  });

  detallesEmpleado = computed(() => {
    const d = this.detallesSeleccionados();
    return d && 'idEmpleado' in d ? d as Partial<Empleado> : null;
  });

  visibleHistorial = signal(false); // Cambiado a signal porque es estado puramente local
  visibleDetalles = model(false);

  // Regla: Usar computed() para estado derivado
  camposFiltroDinamico = computed(() => {
    const campos = this.camposFiltroGlobal();
    return campos.length > 0 ? campos : this.columnas().map((col) => col.field);
  });

  estadisticas = computed<EstadisticasData | null>(() => {
    if (this.columnas().length > 0) return null;

    const data = this.datos() as Dispositivo[];
    const total = data.length;
    const activos = data.filter((d) => d.estadoDisp !== false).length;
    const inactivos = total - activos;
    const enUso = data.filter((d) => d.estadoDisp !== false && d.enUso === true).length;
    const disponibles = activos - enUso;
    const empleadosActivos = this.empleados().filter((e) => e.estadoEmpleado !== false).length;

    return { total, activos, inactivos, enUso, disponibles, empleadosActivos };
  });

  datosFiltrados = computed(() => {
    let datosProcesados = this.datos();

    if (datosProcesados.length > 0 && 'idAsignacion' in datosProcesados[0]) {
      const asignacionesPorDispositivo = new Map<number, Asignacion>();
      for (const asignacion of datosProcesados as Asignacion[]) {
        const idDisp = asignacion.dispositivo?.idDispositivo;
        if (idDisp) {
          const existente = asignacionesPorDispositivo.get(idDisp);
          if (!existente || asignacion.idAsignacion > existente.idAsignacion) {
            asignacionesPorDispositivo.set(idDisp, asignacion);
          }
        }
      }
      datosProcesados = Array.from(asignacionesPorDispositivo.values());
    }

    if (this.mostrarInactivos()) {
      return datosProcesados;
    }
    return datosProcesados.filter(item => {
      if ('estadoDisp' in item) return (item as Dispositivo).estadoDisp !== false;
      if ('estadoEmpleado' in item) return (item as Empleado).estadoEmpleado !== false;
      if ('idAsignacion' in item) return (item as Asignacion).fechaDesvinculacion == null;
      return true;
    });
  });

  getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return null;
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }

  clear(table: Table) {
    table.clear();
  }

  getTextoEstado(rowData: Entidad, field: string): string {
    if (field === 'estadoDisp' && 'estadoDisp' in rowData) {
      if (rowData.estadoDisp === false) return 'Dado de baja';
      return rowData.enUso ? 'Asignado' : 'Disponible';
    }
    if (field === 'estadoEmpleado' && 'estadoEmpleado' in rowData) {
      return rowData.estadoEmpleado === false ? 'Dado de baja' : 'Activo';
    }
    return (rowData as any)[field] ? 'Sí' : 'No';
  }

  getSeveridadEstado(rowData: Entidad, field: string): 'danger' | 'info' | 'success' {
    if (field === 'estadoDisp' && 'estadoDisp' in rowData) {
      if (rowData.estadoDisp === false) return 'danger';
      return rowData.enUso ? 'info' : 'success';
    }
    if (field === 'estadoEmpleado' && 'estadoEmpleado' in rowData) {
      return rowData.estadoEmpleado === false ? 'danger' : 'success';
    }
    return (rowData as any)[field] ? 'success' : 'danger';
  }

  getOpacidadFila(rowData: Entidad): string {
    return 'idAsignacion' in rowData && rowData.fechaDesvinculacion ? '0.5' : '1';
  }

  esFilaClickeable(rowData: Entidad): boolean {
    return ('idDispositivo' in rowData || 'idEmpleado' in rowData) && !('idAsignacion' in rowData);
  }

  esEmpleadoInactivo(rowData: Entidad): boolean {
    return 'estadoEmpleado' in rowData && rowData.estadoEmpleado === false;
  }

  esAsignacion(rowData: Entidad): boolean {
    return 'idAsignacion' in rowData;
  }

  esAsignacionDesvinculada(rowData: Entidad): boolean {
    return 'idAsignacion' in rowData && rowData.fechaDesvinculacion !== null;
  }

  editarDatos(data: Entidad) {
    this.onEdit.emit(data);
  }

  verHistorial(data: Entidad) {
    if ('idAsignacion' in data) return;
    this.entidadHistorial.set(data);
    this.visibleHistorial.set(true);
  }

  verDetalles(data: Entidad) {
    if (('idDispositivo' in data || 'idEmpleado' in data) && !('idAsignacion' in data)) {
      this.detallesSeleccionados.set(data);
      this.visibleDetalles.set(true);
    }
  }

  eliminarDatos(data: Entidad) {
    this.onEliminar.emit(data);
  }

  reactivarEmpleado(empleado: Entidad) {
    this.onReactivar.emit(empleado);
  }
}
