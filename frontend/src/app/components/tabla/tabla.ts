import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogoDispositivo } from '../dialogoDispositivo/dialogoDispositivo';
import { dispositivoService } from '../../services/dispositivo.service';

@Component({
  templateUrl: './tabla.html',
  standalone: true,
  selector: 'app-table-demo',
  imports: [
    TableModule,
    CommonModule,
    FormsModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    TagModule,
    InputTextModule,
    Button,
    DialogModule,
    DialogoDispositivo,
  ],
})
export class TableBasicDemo implements OnInit {
  @Input() datos: any[] = [];
  @Input() columnas: any[] = [];
  @Input() camposFiltroGlobal: string[] = [];
  @Output() datosActualizados = new EventEmitter<void>();
  loading: boolean = true;
  visible: boolean = false;
  dispositivoSeleccionado: any = {};

  constructor(private dispositivoService: dispositivoService) {}

  get camposFiltroDinamico(): string[] {
    if (this.camposFiltroGlobal && this.camposFiltroGlobal.length > 0) {
      return this.camposFiltroGlobal;
    }
    return this.columnas.map((col) => col.field);
  }


  ngOnInit() {
    this.loading = false;
  }

  abrirDialogo(){
    this.dispositivoSeleccionado = {};
    this.visible = true;
  }

  visibleChange(event: boolean) {
    this.visible = event;
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(estado: boolean) {
    return estado ? 'success' : 'danger';
  }

  editarDispositivo(dispositivo: any) {
    this.dispositivoSeleccionado = { ...dispositivo };

    if (this.dispositivoSeleccionado.fechaCompra) {
      const [year, month, day] = String(this.dispositivoSeleccionado.fechaCompra).split('-').map(Number);
      this.dispositivoSeleccionado.fechaCompra = new Date(year, month - 1, day);
    }

    console.log(this.dispositivoSeleccionado);
    this.visible = true;
  }

  eliminarDispositivo(dispositivo: any) {
    // Lógica para confirmar y eliminar usando dispositivo.idDispositivo
  }

  guardarDispositivo(dispositivoGuardado: any) {
    if (dispositivoGuardado.idDispositivo) {
      this.dispositivoService.actualizar(dispositivoGuardado.idDispositivo, dispositivoGuardado).subscribe({
        next: (dispositivoActualizado: any) => {
          const index = this.datos.findIndex((d) => d.idDispositivo === dispositivoActualizado.idDispositivo);
          if (index !== -1) {
            this.datos[index] = dispositivoActualizado;
            this.datos = [...this.datos];
            this.datosActualizados.emit();
          }
        },
        error: (err) => console.error('Error al modificar dispositivo', err)
      });
    } else {
      this.dispositivoService.crear(dispositivoGuardado).subscribe({
        next: (nuevoDispositivo: any) => {
          this.datos.unshift(nuevoDispositivo);
          this.datos = [...this.datos]; 
          this.datosActualizados.emit();
        },
        error: (err) => console.error('Error al crear dispositivo', err)
      });
    }
  }
}
