import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/empleados';

  obtenerTodos(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  crear(empleado: Partial<Empleado>): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  actualizar(id: number, empleado: Partial<Empleado>): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, empleado);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`);
  }
}
