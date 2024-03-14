import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/config';
import { Venta } from '../interfaces/venta';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Venta/';
  }

  Registrar(request: Venta): Observable<ResponseApi> {
    return this.http.post<any>(this.apiUrl + 'Registrar', request);
  }

  Historial(buscarPor: string, numeroVenta: string, fechainicio: string, fechafin: string): Observable<ResponseApi> {
    return this.http.get<any>(`${this.apiUrl}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechainicio=${fechainicio}&fechafin=${fechafin}`);
  }
  Reporte(fechainicio: string, fechafin: string): Observable<ResponseApi> {
    return this.http.get<any>(`${this.apiUrl}Reporte?fechainicio=${fechainicio}&fechafin=${fechafin}`);
  }
}
