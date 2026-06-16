import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EstadisticasData {
  total: number;
  activos: number;
  inactivos: number;
  enUso: number;
  disponibles: number;
  empleadosActivos: number;
}

@Component({
  selector: 'app-dashboard-estadisticas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboardEstadisticas.html'
})
export class DashboardEstadisticas {
  estadisticas = input<EstadisticasData | null>(null);
}