import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar) {
   }
   mostraralerta(mensaje:string,tipo:string){
    this._snackBar.open(mensaje,tipo,{
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
   }
   guardarSesionUsuario(usuarioSesion:Sesion){
    localStorage.setItem('usuarioSesion',JSON.stringify(usuarioSesion));
   }
   obtenerSesionUsuario(){
    const datacadena =localStorage.getItem("usuarioSesion");
    const usuario = JSON.parse(datacadena!);
    return usuario;
   }
   eliminarSesion(){
    localStorage.removeItem("usuarioSesion");
   }
}
