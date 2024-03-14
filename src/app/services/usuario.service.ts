import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Login } from '../interfaces/login';
import { Usuario } from '../interfaces/usuario';
import { environment } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Usuario';
  }

  iniciarSesion(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}/iniciarSesion`, request);
  }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}/lista`);
  }

  guardar(usuario: Usuario): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}/guardar`, usuario);
  }

  actualizar(usuario: Usuario, id: number): Observable<ResponseApi> {
    return this.http.patch<ResponseApi>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}/${id}`);
  }
}
