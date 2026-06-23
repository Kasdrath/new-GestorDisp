import { ChangeDetectionStrategy, Component, effect, inject, model, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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

import { Dispositivo } from '../../models/dispositivo';

export interface StatusOption {
  label: string;
  value: boolean;
}

export interface TipoOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dialogo-dispositivo',
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
    ToastModule,
  ],
  templateUrl: './dialogoDispositivo.html',
  styleUrl: './dialogoDispositivo.css',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogoDispositivo {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  // Regla: Usar model() y output() en lugar de decoradores
  dispositivo = model<Partial<Dispositivo>>({});
  visible = model(false);
  onSave = output<Partial<Dispositivo>>();
  
  // Regla: Usar signal para el estado local
  submitted = signal(false);
  
  statuses: StatusOption[] = [
    { label: 'Activo', value: true },
    { label: 'Dado de baja', value: false },
  ];
  
  tiposDeDispositivo: TipoOption[] = [
    { label: 'Computador', value: 'computador' },
    { label: 'Teléfono', value: 'telefono' },
  ];

  form = this.fb.group({
    numeroSerie: ['', Validators.required],
    marcaDisp: ['', Validators.required],
    modeloDisp: ['', Validators.required],
    tamanoPantalla: ['', Validators.required],
    fechaCompra: [null as Date | null, Validators.required],
    tipo: ['', Validators.required],
    estadoDisp: [true, Validators.required],
    procesadorComp: [''],
    memoriaComp: [''],
    almacenamientoComp: [''],
    numeroTelefono: [''],
    companiaTelefono: [''],
  });

  constructor() {
    effect(() => {
      const disp = this.dispositivo();
      if (disp) {
        let tipoForm = '';
        if (disp.tipoDispositivo?.idTipoDisp === 1) {
          tipoForm = 'computador';
        } else if (disp.tipoDispositivo?.idTipoDisp === 2) {
          tipoForm = 'telefono';
        } else if (disp.tipo) {
          tipoForm = disp.tipo;
        }

        let fecha: Date | null = null;
        if (disp.fechaCompra) {
          if (disp.fechaCompra instanceof Date) {
            fecha = disp.fechaCompra;
          } else {
            const [year, month, day] = String(disp.fechaCompra).split('-').map(Number);
            if (year && month && day) {
              fecha = new Date(year, month - 1, day);
            }
          }
        }

        this.form.patchValue({
          numeroSerie: disp.numeroSerie || '',
          marcaDisp: disp.marcaDisp || '',
          modeloDisp: disp.modeloDisp || '',
          tamanoPantalla: disp.tamanoPantalla || '',
          fechaCompra: fecha,
          tipo: tipoForm,
          estadoDisp: disp.estadoDisp !== false,
          procesadorComp: disp.procesadorComp || '',
          memoriaComp: disp.memoriaComp || '',
          almacenamientoComp: disp.almacenamientoComp || '',
          numeroTelefono: disp.numeroTelefono || '',
          companiaTelefono: disp.companiaTelefono || '',
        }, { emitEvent: true });
        
        this.configurarValidadoresCondicionales(tipoForm);
      }
    });

    this.form.get('tipo')?.valueChanges.subscribe(tipo => {
      this.configurarValidadoresCondicionales(tipo);
    });
  }

  configurarValidadoresCondicionales(tipo: string | null) {
    const compFields = ['procesadorComp', 'memoriaComp', 'almacenamientoComp'];
    const telFields = ['numeroTelefono', 'companiaTelefono'];

    if (tipo === 'computador') {
      compFields.forEach(f => {
        this.form.get(f)?.setValidators(Validators.required);
      });
      telFields.forEach(f => {
        this.form.get(f)?.clearValidators();
      });
    } else if (tipo === 'telefono') {
      telFields.forEach(f => {
        this.form.get(f)?.setValidators(Validators.required);
      });
      compFields.forEach(f => {
        this.form.get(f)?.clearValidators();
      });
    } else {
      compFields.concat(telFields).forEach(f => {
        this.form.get(f)?.clearValidators();
      });
    }
    compFields.concat(telFields).forEach(f => {
      this.form.get(f)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  openNewDispositivo() {
    this.dispositivo.set({});
    this.form.reset({ estadoDisp: true, tipo: '' });
    this.submitted.set(false);
    this.visible.set(true);
  }

  hideDialog() {
    this.visible.set(false);
  }

  saveDispositivo() {
    this.submitted.set(true);
    if (this.form.valid) {
      const val = this.form.value;
      const disp: Partial<Dispositivo> = {
        ...this.dispositivo(),
        numeroSerie: val.numeroSerie || undefined,
        marcaDisp: val.marcaDisp || undefined,
        modeloDisp: val.modeloDisp || undefined,
        tamanoPantalla: val.tamanoPantalla || undefined,
        estadoDisp: val.estadoDisp !== false,
        tipo: val.tipo || undefined,
      };

      if (val.fechaCompra) {
        const d = val.fechaCompra instanceof Date ? val.fechaCompra : new Date(val.fechaCompra);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        disp.fechaCompra = `${year}-${month}-${day}`;
      }

      if (val.tipo === 'computador') {
        disp.tipoDispositivo = { idTipoDisp: 1 };
        disp.procesadorComp = val.procesadorComp || undefined;
        disp.memoriaComp = val.memoriaComp || undefined;
        disp.almacenamientoComp = val.almacenamientoComp || undefined;
        disp.numeroTelefono = null as any;
        disp.companiaTelefono = null as any;
      } else if (val.tipo === 'telefono') {
        disp.tipoDispositivo = { idTipoDisp: 2 };
        disp.numeroTelefono = val.numeroTelefono || undefined;
        disp.companiaTelefono = val.companiaTelefono || undefined;
        disp.procesadorComp = null as any;
        disp.memoriaComp = null as any;
        disp.almacenamientoComp = null as any;
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
