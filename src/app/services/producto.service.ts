import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/config';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Producto/';
  }

  getProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  guardarProductos(request: Producto): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'Guardar', request);
  }

  actualizarProductos(request: Producto, id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}${id}`, request);
  }
  eliminarProductos(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}`);
  }
}
