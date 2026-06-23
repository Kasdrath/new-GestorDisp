import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asignacion } from '../models/asignacion';

@Injectable({
  providedIn: 'root',
})
export class AsignacionesService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/asignaciones";

  obtenerTodos(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.apiUrl);
  }
  
  actualizar(id: number, asignacion: Partial<Asignacion>): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.apiUrl}/${id}`, asignacion);
  }
  eliminar(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`);
  }
  vincular(idEmpleado: number, idDispositivo: number): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.apiUrl}/vincular?idEmpleado=${idEmpleado}&idDispositivo=${idDispositivo}`, {});
  }
  
}
