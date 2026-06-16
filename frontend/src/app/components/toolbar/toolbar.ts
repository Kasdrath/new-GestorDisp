import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DialogoDispositivo } from '../dialogoDispositivo/dialogoDispositivo';
import { DialogoEmpleado } from '../dialogoEmpleado/dialogoEmpleado';
import { dispositivoService } from '../../services/dispositivo.service';
import { empleadoService } from '../../services/empleado.service';
import { AsignacionesService } from '../../services/asignaciones.service';
import { DialogoAsignacion } from '../dialogoAsignacion/dialogoAsignacion';

@Component({
  selector: 'app-toolbar',
  imports: [
    ButtonModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    DialogoDispositivo,
    DialogoEmpleado,
    DialogoAsignacion
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  // Regla: Usar input() y output() en lugar de decoradores
  tipoVistaActual = input<string>('Devices');
  datosActualizados = output<string>();

  // Regla: Usar signal para el estado local
  visible = signal(false);
  visibleEmpleado = signal(false);
  visibleAsignacion = signal(false);
  dataSelected = signal<any>({});

  // Regla: Usar inject() en lugar de inyección por constructor
  private messageService = inject(MessageService);
  private dispositivoService = inject(dispositivoService);
  private empleadoService = inject(empleadoService);
  private asignacionService = inject(AsignacionesService);

  abrirDialogo() {
    this.dataSelected.set({});
    
    if (this.tipoVistaActual() === 'Empleados') {
      this.visibleEmpleado.set(true);
    } else if (this.tipoVistaActual() === 'Asignacion') {
      this.visibleAsignacion.set(true);
    } else {
      this.visible.set(true);
    }
  }

  editarEntidad(data: any) {
    if ('idDispositivo' in data) {
      const dispositivo = { ...data };
      if (dispositivo.fechaCompra) {
        const [year, month, day] = String(dispositivo.fechaCompra).split('-').map(Number);
        dispositivo.fechaCompra = new Date(year, month - 1, day);
      }
      this.dataSelected.set(dispositivo);
      this.visible.set(true);
    } else if ('idEmpleado' in data) {
      this.dataSelected.set({ ...data });
      this.visibleEmpleado.set(true);
    }
  }

  guardarDispositivo(dispositivoGuardado: any) {
    if (dispositivoGuardado.idDispositivo) {
      this.dispositivoService
        .actualizar(dispositivoGuardado.idDispositivo, dispositivoGuardado)
        .subscribe({
          next: (response) => {
            console.log('Dispositivo actualizado:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Dispositivo actualizado correctamente',
              life: 3000,
            });
            this.datosActualizados.emit('dispositivos');
          },
          error: (error) => {
            console.error('Error al actualizar el dispositivo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un error al actualizar el dispositivo',
            });
          },
        });
    } else {
      this.dispositivoService.crear(dispositivoGuardado).subscribe({
        next: (response) => {
          console.log('Dispositivo creado:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Dispositivo agregado correctamente',
            life: 3000,
          });
          this.datosActualizados.emit('dispositivos');
        },
        error: (error) => {
          console.error('Error al crear el dispositivo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al agregar el dispositivo',
          });
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al actualizar el empleado' });
        },
      });
    } else {
      this.empleadoService.crear(empleadoGuardado).subscribe({
        next: (response) => {
          console.log('Empleado creado:', response);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado agregado correctamente', life: 3000 });
          this.datosActualizados.emit('empleados');
        },
        error: (error) => {
          console.error('Error al crear el empleado:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al agregar el empleado' });
        },
      });
    }
  }

  guardarAsignacion(asignacion: any) {
    this.asignacionService.vincular(asignacion.idEmpleado, asignacion.idDispositivo).subscribe({
      next: (response) => {
        console.log('Asignación creada:', response);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Asignación creada correctamente', life: 3000 });
        this.visibleAsignacion.set(false);
        this.datosActualizados.emit('asignaciones');
        // Emitimos un texto vacío para forzar al componente Inicio a recargar TODO (Asignaciones y Dispositivos)
        this.datosActualizados.emit('');
      },
      error: (error) => {
        console.error('Error al crear la asignación:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al crear la asignación' });
      }
    });
  }
}
