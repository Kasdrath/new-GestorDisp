import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(private messageService: MessageService) {}

  @Input() dispositivo: any = {};
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Activo', value: true },
    { label: 'Dado de baja', value: false },
  ];
  tiposDeDispositivo: any[] = [
    { label: 'Computador', value: 'computador' },
    { label: 'Teléfono', value: 'telefono' },
  ];

  openNewDispositivo() {
    this.dispositivo = {};
    this.submitted = false;
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  saveDispositivo() {
    this.submitted = true;
    let isValid = !!(
      this.dispositivo.numeroSerie?.trim() &&
      this.dispositivo.marcaDisp?.trim() &&
      this.dispositivo.modeloDisp?.trim() &&
      this.dispositivo.tamanoPantalla !== null &&
      this.dispositivo.tamanoPantalla !== undefined &&
      String(this.dispositivo.tamanoPantalla).trim() !== '' &&
      this.dispositivo.fechaCompra &&
      this.dispositivo.estadoDisp !== undefined &&
      this.dispositivo.tipo
    );

    if (this.dispositivo.tipo === 'computador') {
      isValid =
        isValid &&
        !!(
          this.dispositivo.procesadorComp?.trim() &&
          this.dispositivo.memoriaComp?.trim() &&
          this.dispositivo.almacenamientoComp?.trim()
        );
    } else if (this.dispositivo.tipo === 'telefono') {
      isValid =
        isValid &&
        !!(this.dispositivo.numeroTelefono?.trim() && this.dispositivo.companiaTelefono?.trim());
    }

    if (isValid) {
      if (this.dispositivo.fechaCompra instanceof Date) {
        const d = this.dispositivo.fechaCompra;
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        this.dispositivo.fechaCompra = `${year}-${month}-${day}`;
      }

      if (this.dispositivo.tipo === 'computador') {
        this.dispositivo.tipoDispositivo = { idTipoDisp: 1 };
      } else if (this.dispositivo.tipo === 'telefono') {
        this.dispositivo.tipoDispositivo = { idTipoDisp: 2 };
      }

      this.onSave.emit(this.dispositivo);

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
