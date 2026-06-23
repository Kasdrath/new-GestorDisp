import { Asignacion } from './asignacion';

export interface Dispositivo {
  idDispositivo: number;
  tipo?: string;
  numeroSerie: string;
  marcaDisp: string;
  modeloDisp: string;
  fechaCompra: Date | string;
  estadoDisp: boolean;
  enUso?: boolean;
  tipoDispositivo?: { idTipoDisp: number; tipoDispositivo?: string };
  asignaciones?: Asignacion[];

  tamanoPantalla?: string;
  procesadorComp?: string;
  memoriaComp?: string;
  almacenamientoComp?: string;
  companiaTelefono?: string;
  numeroTelefono?: string;
}
