import { ChangeDetectionStrategy, Component, inject, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dialogo-dispositivo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    ToastModule,
  ],
  templateUrl: './dialogoDispositivo.html',
  styleUrl: './dialogoDispositivo.css',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogoDispositivo {
  private messageService = inject(MessageService);

  // Regla: Usar model() y output() en lugar de decoradores
  dispositivo = model<any>({});
  visible = model(false);
  onSave = output<any>();
  
  // Regla: Usar signal para el estado local
  submitted = signal(false);
  
  statuses: any[] = [
    { label: 'Activo', value: true },
    { label: 'Dado de baja', value: false },
  ];
  
  tiposDeDispositivo: any[] = [
    { label: 'Computador', value: 'computador' },
    { label: 'Teléfono', value: 'telefono' },
  ];

  openNewDispositivo() {
    this.dispositivo.set({});
    this.submitted.set(false);
    this.visible.set(true);
  }

  hideDialog() {
    this.visible.set(false);
  }

  saveDispositivo() {
    this.submitted.set(true);
    const disp = this.dispositivo();
    let isValid = !!(
      disp.numeroSerie?.trim() &&
      disp.marcaDisp?.trim() &&
      disp.modeloDisp?.trim() &&
      disp.tamanoPantalla !== null &&
      disp.tamanoPantalla !== undefined &&
      String(disp.tamanoPantalla).trim() !== '' &&
      disp.fechaCompra &&
      disp.estadoDisp !== undefined &&
      disp.tipo
    );

    if (disp.tipo === 'computador') {
      isValid =
        isValid &&
        !!(
          disp.procesadorComp?.trim() &&
          disp.memoriaComp?.trim() &&
          disp.almacenamientoComp?.trim()
        );
    } else if (disp.tipo === 'telefono') {
      isValid =
        isValid &&
        !!(disp.numeroTelefono?.trim() && disp.companiaTelefono?.trim());
    }

    if (isValid) {
      if (disp.fechaCompra instanceof Date) {
        const d = disp.fechaCompra;
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        disp.fechaCompra = `${year}-${month}-${day}`;
      }

      if (disp.tipo === 'computador') {
        disp.tipoDispositivo = { idTipoDisp: 1 };
      } else if (disp.tipo === 'telefono') {
        disp.tipoDispositivo = { idTipoDisp: 2 };
      }

      this.onSave.emit(disp);
      this.hideDialog();
    }
  }

  showToastSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Info',
      detail: 'Creado exitosamente',
    });
    console.log('Archivo subido exitosamente');
  }
  showToastDelete() {
    this.messageService.add({
      severity: 'danger',
      summary: 'Error',
      detail: 'Elemento eliminado',
    });
  }
}
