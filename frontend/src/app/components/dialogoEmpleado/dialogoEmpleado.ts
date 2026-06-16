import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';
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
  ],
  templateUrl: './dialogoEmpleado.html',
  styleUrl: './dialogoEmpleado.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogoEmpleado {
  // Regla: Usar model() y output() en lugar de decoradores
  empleado = model<any>({});
  visible = model(false);
  onSave = output<any>();
  
  // Regla: Usar signal para el estado local
  submitted = signal(false);

  openNewEmpleado() {
    this.empleado.set({});
    this.submitted.set(false);
    this.visible.set(true);
  }

  hideDialog() {
    this.visible.set(false);
  }

  saveEmpleado() {
    this.submitted.set(true);
    const emp = this.empleado();
    let isValid = !!(
      emp.nombresEmpleado?.trim() &&
      emp.apellidosEmpleado?.trim() &&
      emp.rutEmpleado?.trim() &&
      emp.emailEmpleado?.trim() &&
      emp.telefonoEmpleado?.trim() &&
      emp.nacionalidadEmpleado?.trim() &&
      emp.cargoEmpleado?.trim()
    );
    if (isValid) {
      this.onSave.emit(emp);
      this.hideDialog();
    }
  }
}
