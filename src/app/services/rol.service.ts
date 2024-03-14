import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Rol } from '../interfaces/rol';
import { environment } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'Rol';
  }

  getRoles(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}/lista`);
  }
}
