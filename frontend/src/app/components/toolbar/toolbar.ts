import { ChangeDetectionStrategy, Component, Output, EventEmitter} from '@angular/core';
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
  @Output() datosActualizados = new EventEmitter<void>();
  visible: boolean = false;
  dataSelected: any = {};
  tipoVistaActual: string = 'Devices';

  constructor(
    private messageService: MessageService,
    private dispositivoService: dispositivoService,
    private empleadoService: empleadoService,
  ) {}

  abrirDialogo() {
    this.dataSelected = {};
    this.visible = true;
  }
  visibleChange(event: boolean) {
    this.visible = event;
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
              life: 3000
            });
            this.datosActualizados.emit();
          },
          error: (error) => {
            console.error('Error al actualizar el dispositivo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un error al actualizar el dispositivo'
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
            life: 3000
          });
          this.datosActualizados.emit();
        },
        error: (error) => {
          console.error('Error al crear el dispositivo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al agregar el dispositivo'
          });
        },
      });
    }
  }
  cargarAgregar(deviceType: string) {
    if (this.tipoVistaActual === 'Devices') {
      

    }
  }
}
