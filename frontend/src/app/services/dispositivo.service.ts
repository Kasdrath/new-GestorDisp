import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../models/dispositivo';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/dispositivos';

  obtenerTodos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.apiUrl);
  }

  crear(dispositivo: Partial<Dispositivo>): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(this.apiUrl, dispositivo);
  }

  actualizar(id: number, dispositivo: Partial<Dispositivo>): Observable<Dispositivo> {
    return this.http.put<Dispositivo>(`${this.apiUrl}/${id}`, dispositivo);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`);
  }

}
