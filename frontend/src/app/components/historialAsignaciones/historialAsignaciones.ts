import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Entidad, Asignacion } from '../tabla/tabla';

@Component({
  selector: 'app-historial-asignaciones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, TagModule],
  templateUrl: './historialAsignaciones.html'
})
export class HistorialAsignaciones {
  private asignacionService = inject(AsignacionesService);

  visible = model(false);
  entidad = input<Entidad | null>(null);

  historial = signal<Asignacion[]>([]);
  
  esDispositivo = computed(() => {
    const e = this.entidad();
    return e ? 'idDispositivo' in e : false;
  });

  tituloEntidad = computed(() => {
    const e = this.entidad();
    if (!e) return '';
    if ('idDispositivo' in e) return `Dispositivo: ${e.marcaDisp} ${e.modeloDisp} (N/S: ${e.numeroSerie})`;
    if ('idEmpleado' in e) return `Empleado: ${e.nombresEmpleado} ${e.apellidosEmpleado}`;
    return '';
  });

  constructor() {
    // Se ejecuta automáticamente cada vez que cambia la visibilidad o la entidad
    effect(() => {
      if (this.visible() && this.entidad()) {
        this.cargarHistorial();
      } else {
        this.historial.set([]);
      }
    });
  }

  cargarHistorial() {
    const data = this.entidad();
    if (!data || 'idAsignacion' in data) return;

    this.asignacionService.obtenerTodos().subscribe({
      next: (asignaciones: Asignacion[]) => {
        const asignacionesFormateadas = asignaciones.map(a => ({
          ...a,
          fechaAsignacion: this.formatearFechaIso(a.fechaAsignacion),
          fechaDesvinculacion: this.formatearFechaIso(a.fechaDesvinculacion)
        }));

        const hist = 'idDispositivo' in data
          ? asignacionesFormateadas.filter(a => a.dispositivo?.idDispositivo === data.idDispositivo)
          : asignacionesFormateadas.filter(a => a.empleado?.idEmpleado === data.idEmpleado);

        hist.sort((a, b) => new Date(b.fechaAsignacion || 0).getTime() - new Date(a.fechaAsignacion || 0).getTime());
        this.historial.set(hist);
      },
      error: (err) => console.error('Error cargando historial', err)
    });
  }

  private formatearFechaIso(fecha: unknown): string | null {
    if (!fecha) return null;
    if (typeof fecha !== 'string') return String(fecha);
    const partes = fecha.split(' ');
    if (partes.length === 2 && partes[0].includes('-')) {
      const [dia, mes, anio] = partes[0].split('-');
      if (dia && mes && anio && dia.length <= 2 && anio.length === 4) {
        return `${anio}-${mes}-${dia}T${partes[1]}`;
      }
    }
    return fecha;
  }

  exportarHistorial() {
    const hist = this.historial();
    if (hist.length === 0) return;

    const separador = ';';
    let csv = this.esDispositivo() ? 'Empleado Asignado' : 'Dispositivo';
    csv += `${separador}Fecha Asignación${separador}Fecha Devolución${separador}Estado\n`;

    hist.forEach(h => {
      let columna1 = '';
      if (this.esDispositivo()) {
        columna1 = `${h.empleado?.nombresEmpleado ?? ''} ${h.empleado?.apellidosEmpleado ?? ''}`;
      } else {
        columna1 = `${h.dispositivo?.marcaDisp ?? ''} ${h.dispositivo?.modeloDisp ?? ''} (N/S: ${h.dispositivo?.numeroSerie ?? ''})`;
      }
      
      const formatFecha = (fechaStr: string | null) => {
        if (!fechaStr) return '-';
        const fecha = new Date(fechaStr);
        return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()} ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
      };

      const fechaAsig = formatFecha(h.fechaAsignacion);
      const fechaDev = formatFecha(h.fechaDesvinculacion);
      const estado = h.fechaDesvinculacion ? 'Devuelto' : 'Activo';

      const escapeCSV = (texto: string) => `"${texto.replace(/"/g, '""')}"`;
      csv += `${escapeCSV(columna1)}${separador}${escapeCSV(fechaAsig)}${separador}${escapeCSV(fechaDev)}${separador}${escapeCSV(estado)}\n`;
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_${this.esDispositivo() ? 'dispositivo' : 'empleado'}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}