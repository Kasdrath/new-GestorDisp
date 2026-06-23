import { ChangeDetectionStrategy, Component, effect, inject, model, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Empleado } from '../../models/empleado';

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
    ReactiveFormsModule,
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
  private fb = inject(FormBuilder);

  // Regla: Usar model() y output() en lugar de decoradores
  empleado = model<Partial<Empleado>>({});
  visible = model(false);
  onSave = output<Partial<Empleado>>();

  // Regla: Usar signal para el estado local
  submitted = signal(false);

  form = this.fb.group({
    nombresEmpleado: ['', Validators.required],
    apellidosEmpleado: ['', Validators.required],
    rutEmpleado: ['', Validators.required],
    emailEmpleado: ['', [Validators.required, Validators.email]],
    telefonoEmpleado: ['', Validators.required],
    nacionalidadEmpleado: ['', Validators.required],
    cargoEmpleado: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const emp = this.empleado();
      if (emp) {
        this.form.patchValue({
          nombresEmpleado: emp.nombresEmpleado || '',
          apellidosEmpleado: emp.apellidosEmpleado || '',
          rutEmpleado: emp.rutEmpleado || '',
          emailEmpleado: emp.emailEmpleado || '',
          telefonoEmpleado: emp.telefonoEmpleado || '',
          nacionalidadEmpleado: emp.nacionalidadEmpleado || '',
          cargoEmpleado: emp.cargoEmpleado || '',
        }, { emitEvent: false });
      }
    });
  }

  openNewEmpleado() {
    this.empleado.set({});
    this.form.reset();
    this.submitted.set(false);
    this.visible.set(true);
  }

  hideDialog() {
    this.visible.set(false);
  }

  saveEmpleado() {
    this.submitted.set(true);
    if (this.form.valid) {
      const empData = { ...this.empleado(), ...this.form.value };
      this.onSave.emit(empData as Partial<Empleado>);
      this.hideDialog();
    }
  }
}
