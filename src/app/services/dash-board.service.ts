import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/config';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Dashboard/';
  }

  Resumen(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}Resumen?idUsuario=${idUsuario}`);
  }
}
