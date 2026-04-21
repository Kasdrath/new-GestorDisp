import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelmenuBasicDemo } from "../menupanel/menupanel";
import { TableBasicDemo } from '../tabla/tabla';
import { dispositivoService } from '../../services/dispositivo.service';
import { empleadoService } from '../../services/empleado.service';


@Component({
  selector: 'app-inicio',
  imports: [CommonModule, PanelmenuBasicDemo, TableBasicDemo],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class Inicio {
  private dispositivoService = inject(dispositivoService);
  private empleadoService = inject(empleadoService);
  private cdr = inject(ChangeDetectorRef);

  dispositivos: any[] = [];
  empleados: any[] = [];
  mostrarTablaComp = false;
  datos: any[] = [];
  columnas: any[] = [];
  camposFiltroGlobal: any[] = [];
  loading: boolean = true;


  private columnasBase = [
    { field: 'idDispositivo', header: 'ID', type: 'numeric' },
    { field: 'numeroSerie', header: 'N/S', type: 'text' },
    { field: 'marcaDisp', header: 'Marca', type: 'text' },
    { field: 'modeloDisp', header: 'Modelo', type: 'text' },
    { field: 'fechaCompra', header: 'Fecha Compra', type: 'date' },
    { field: 'estadoDisp', header: 'Estado', type: 'boolean' }
  ];
  ngOnInit() {
    this.dispositivoService.obtenerTodos().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        this.dispositivos = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los datos del backend:', error);
        this.loading = false;
      }
    });

    this.empleadoService.obtenerTodos().subscribe({
      next: (data) => {
        this.empleados = [...data];
        this.loading = false;
        this.cdr.detectChanges();
        console.log("funciona");
      },
      error: (error) => {
        console.error('Error al obtener los datos del backend: empleados', error);
        this.loading = false;
      }
    });
    
  }
  cargarTablaDispositivos(deviceType: string) {
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
          { field: 'almacenamientoComp', header: 'Almacenamiento', type: 'text' }
        ];
        this.datos = this.dispositivos.filter(d => d.tipoDispositivo?.idTipoDisp == 1);
        break;
      case 'Phone':
        this.columnas = [
          ...this.columnasBase,
          { field: 'companiaTelefono', header: 'Compañia', type: 'text' },
          { field: 'numeroTelefono', header: 'Número', type: 'text' }
        ];
        this.datos = this.dispositivos.filter(d => d.tipoDispositivo?.idTipoDisp == 2);
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
          { field: 'cargoEmpleado', header: 'Cargo', type: 'text' }
        ];

        this.datos = this.empleados;
        break;
      default:
        this.columnas = [...this.columnasBase];
        this.datos = [...this.dispositivos];
        break;
    }
  }


  cargarTablaComputadoras(deviceType: string) {

  }
}
