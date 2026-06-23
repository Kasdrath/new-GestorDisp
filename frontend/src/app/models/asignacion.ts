import { Dispositivo } from './dispositivo';
import { Empleado } from './empleado';

export interface Asignacion {
  idAsignacion: number;
  dispositivo?: Partial<Dispositivo>;
  empleado?: Partial<Empleado>;
  fechaAsignacion: string | null;
  fechaDesvinculacion: string | null;
}
