import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Menu } from '../interfaces/menu';
import { environment } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Menu/';
  }

  getMenus(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}Menu?idUsuario=${idUsuario}`);
  }
}
