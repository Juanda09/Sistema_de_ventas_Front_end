import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  listasMenus:Menu[ ] = [];
  correoUsuario:string = "";
  rolUsuario:string = "";

  constructor(
    private router: Router,
    private menuService: MenuService,
    private utilidadService: UtilidadService
  ) { }
  ngOnInit():void {
    const usuario = this.utilidadService.obtenerSesionUsuario();
    if(usuario != null){
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
      this.menuService.getMenus(usuario.idUsuario).subscribe({
        next:(data)=>{
          if(data.status){
            this.listasMenus = data.value;
          }
        }
      })
    }
  }
  cerrarSesion(){
    this.utilidadService.eliminarSesion();
    this.router.navigate(['/login']);
  }
}
