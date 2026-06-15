import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelmenuBasicDemo } from '../menupanel/menupanel';
import { TableBasicDemo } from '../tabla/tabla';
import { dispositivoService } from '../../services/dispositivo.service';
import { empleadoService } from '../../services/empleado.service';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Toolbar } from '../toolbar/toolbar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, PanelmenuBasicDemo, TableBasicDemo, Toolbar],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  providers: [MessageService]
})
export class Inicio {
  private dispositivoService = inject(dispositivoService);
  private empleadoService = inject(empleadoService);
  private asignacionService = inject(AsignacionesService);
  private cdr = inject(ChangeDetectorRef);

  dispositivos: any[] = [];
  empleados: any[] = [];
  asignaciones: any[] = [];
  mostrarTablaComp = false;
  datos: any[] = [];
  columnas: any[] = [];
  camposFiltroGlobal: any[] = [];
  loading: boolean = true;
  tipoVistaActual: string = 'Devices';

  private columnasBase = [
    { field: 'idDispositivo', header: 'ID', type: 'numeric' },
    { field: 'numeroSerie', header: 'N/S', type: 'text' },
    { field: 'marcaDisp', header: 'Marca', type: 'text' },
    { field: 'modeloDisp', header: 'Modelo', type: 'text' },
    { field: 'fechaCompra', header: 'Fecha Compra', type: 'date' },
    { field: 'estadoDisp', header: 'Estado', type: 'boolean' },
    { field: 'enUso', header: 'Disponibilidad', type: 'boolean' },
  ];
  ngOnInit() {
    this.obtenerDatos();
  }

  obtenerDatos(entidad?: string) {
    this.loading = true;
    this.cdr.detectChanges(); // Forzamos a Angular a mostrar el spinner de carga

    // Si no se envía entidad, o es explícitamente 'dispositivos', se recargan
    if (!entidad || entidad === 'dispositivos') {
      this.dispositivoService.obtenerTodos().subscribe({
        next: (data) => {
          console.log('Dispositivos recibidos del backend:', data);
          // Calculamos dinámicamente si el dispositivo está asignado a un empleado
          this.dispositivos = data.map((d: any) => ({
            ...d,
            enUso: d.asignaciones && d.asignaciones.some((a: any) => !a.fechaDesvinculacion)
          }));
          this.cargarTablaDispositivos(this.tipoVistaActual);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al obtener dispositivos:', error);
          this.loading = false;
        }
      });
    }
    // Si no se envía entidad, o es explícitamente 'empleados', se recargan
    if (!entidad || entidad === 'empleados') {
      this.empleadoService.obtenerTodos().subscribe({
        next: (data) => {
          console.log('Empleados recibidos del backend:', data);
          // Mapeamos para asegurar que los empleados antiguos sin estado aparezcan como Activos
          this.empleados = data.map((e: any) => ({
            ...e,
            estadoEmpleado: e.estadoEmpleado !== false 
          }));
          this.cargarTablaDispositivos(this.tipoVistaActual);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al obtener empleados:', error);
          this.loading = false;
        }
      });
    }
    if (!entidad || entidad === 'asignaciones') {
      // Aquí deberías llamar a tu servicio de asignaciones para obtener los datos
      this.asignacionService.obtenerTodos().subscribe({
        next: (data) => {
          console.log('Asignaciones recibidas del backend:', data);
          this.asignaciones = [...data];
          this.cargarTablaDispositivos(this.tipoVistaActual);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al obtener asignaciones:', error);
          this.loading = false;
        }
      });
    }
  }

  cargarTablaDispositivos(deviceType: string) {
    this.tipoVistaActual = deviceType;

    switch (deviceType) {
      case 'Devices':
        this.columnas = [...this.columnasBase];
        this.datos = [...this.dispositivos];
        break;
      case 'Desktop':
        this.columnas = [
          ...this.columnasBase,
          { field: 'procesadorComp', header: 'Procesador', type: 'text' },
          { field: 'memoriaComp', header: 'Memoria', type: 'text' },
          { field: 'almacenamientoComp', header: 'Almacenamiento', type: 'text' },
        ];
        this.datos = this.dispositivos.filter((d) => d.tipoDispositivo?.idTipoDisp == 1);
        break;
      case 'Phone':
        this.columnas = [
          ...this.columnasBase,
          { field: 'companiaTelefono', header: 'Compañia', type: 'text' },
          { field: 'numeroTelefono', header: 'Número', type: 'text' },
        ];
        this.datos = this.dispositivos.filter((d) => d.tipoDispositivo?.idTipoDisp == 2);
        break;
      case 'Empleados':
        this.columnas = [
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
        this.datos = this.empleados;
        break;
      case 'Asignacion':
          this.columnas = [
            { field: 'idAsignacion', header: 'ID', type: 'numeric' },
            { field: 'dispositivo.numeroSerie', header: 'N/S Dispositivo', type: 'text' },
            { field: 'empleado.nombresEmpleado', header: 'Nombre Empleado', type: 'text' },
            { field: 'empleado.apellidosEmpleado', header: 'Apellido Empleado', type: 'text' },
            { field: 'fechaAsignacion', header: 'Fecha Asignación', type: 'datetime' },
            { field: 'fechaDesvinculacion', header: 'Fecha Desvinculación', type: 'datetime' },
          ];
          
          this.datos = [...this.asignaciones];
          break;
      case 'Estadisticas':
        this.columnas = []; // Al dejar las columnas vacías, la tabla sabrá que debe mostrar el Dashboard
        this.datos = [...this.dispositivos]; // Le pasamos todos los dispositivos
        break;
      default:
        this.columnas = [...this.columnasBase];
        this.datos = [...this.dispositivos];
        break;
    }

    this.cdr.detectChanges(); // Forzamos a Angular a repintar la vista de inmediato
  }
}
