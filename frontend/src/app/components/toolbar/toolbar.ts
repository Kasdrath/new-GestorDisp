import { ChangeDetectionStrategy, Component, Output, EventEmitter, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DialogoDispositivo } from '../dialogoDispositivo/dialogoDispositivo';
import { DialogoEmpleado } from '../dialogoEmpleado/dialogoEmpleado';
import { dispositivoService } from '../../services/dispositivo.service';
import { empleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-toolbar',
  imports: [
    ButtonModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    DialogoDispositivo,
    DialogoEmpleado,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  @Input() tipoVistaActual: string = 'Devices';
  @Output() datosActualizados = new EventEmitter<void>();
  visible: boolean = false;
  visibleEmpleado: boolean = false;
  dataSelected: any = {};

  constructor(
    private messageService: MessageService,
    private dispositivoService: dispositivoService,
    private empleadoService: empleadoService,
  ) {}

  abrirDialogo() {
    this.dataSelected = {};
    
    if (this.tipoVistaActual === 'Empleados') {
      this.visibleEmpleado = true;
    } else {
      this.visible = true;
    }
  }

  visibleChange(event: boolean) {
    this.visible = event;
  }
  visibleEmpleadoChange(event: boolean) {
    this.visibleEmpleado = event;
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
            this.datosActualizados.emit();
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
          this.datosActualizados.emit();
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
          this.datosActualizados.emit();
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
          this.datosActualizados.emit();
        },
        error: (error) => {
          console.error('Error al crear el empleado:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al agregar el empleado' });
        },
      });
    }
  }
}
