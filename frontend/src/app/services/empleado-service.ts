import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Device {
  idDisp: number;
  numeroSerie: string;
  marcaDisp: string;
  modeloDIsp: string;
  fechaCompra: string;
  estadoDisp: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/devices'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }
}
