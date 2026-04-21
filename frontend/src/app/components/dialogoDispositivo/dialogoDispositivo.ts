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

@Component({
  selector: 'app-dialogo-dispositivo',
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
  ],
  templateUrl: './dialogoDispositivo.html',
  styleUrl: './dialogoDispositivo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogoDispositivo {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  dispositivo: any = {};
  submitted: boolean = false;
  statuses!: any[];

  openNewDispositivo() {
    this.dispositivo = {};
    this.submitted = false;
    this.visible = true;
    this.visibleChange.emit(this.visible);
    this.statuses = [
      { label: 'Activo', value: true },
      { label: 'Dado de baja', value: false }
    ];
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  saveDispositivo() {
    this.submitted = true;
  }
}
