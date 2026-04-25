import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class dispositivoService {
  private apiUrl = 'http://localhost:8080/api/dispositivos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crear(dispositivo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dispositivo);
  }

  actualizar(id: number, dispositivo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dispositivo);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
