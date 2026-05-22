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
  selector: 'app-dialogo-empleado',
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
  templateUrl: './dialogoEmpleado.html',
  styleUrl: './dialogoEmpleado.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogoEmpleado {
  @Input() empleado: any = {};
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  submitted: boolean = false;

  openNewEmpleado() {
    this.empleado = {};
    this.submitted = false;
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
  saveEmpleado() {
    this.submitted = true;
    let isValid = !!(
      this.empleado.nombresEmpleado?.trim() &&
      this.empleado.apellidosEmpleado?.trim() &&
      this.empleado.rutEmpleado?.trim() &&
      this.empleado.emailEmpleado?.trim() &&
      this.empleado.telefonoEmpleado?.trim() &&
      this.empleado.nacionalidadEmpleado.trim() &&
      this.empleado.cargoEmpleado.trim()
    );
    if (isValid) {
      this.onSave.emit(this.empleado);
      this.hideDialog();
    }
  }
}
