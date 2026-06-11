import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsignacionesService {
  private apiUrl = "http://localhost:8080/api/asignaciones";

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  actualizar(id: number, asignacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asignacion);
  }
  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  vincular(idEmpleado: number, idDispositivo: number) {
    return this.http.post(`${this.apiUrl}/vincular?idEmpleado=${idEmpleado}&idDispositivo=${idDispositivo}`, {});
  }
  
}
