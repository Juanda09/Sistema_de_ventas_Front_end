import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Categoria } from '../interfaces/categoria';
import { environment } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Categoria/';
  }

  getCategorias(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(this.apiUrl + 'Lista');
  }

  guardarCategorias(request: Categoria): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(this.apiUrl + 'Guardar', request);
  }

  eliminarCategorias(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}${id}`);
  }
}
