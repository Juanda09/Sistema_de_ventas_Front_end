import { Component } from '@angular/core';
import { FormBuilder ,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formularioLogin:FormGroup;
  ocultarpassword: boolean = true;
  mostrarLoading:boolean = false;
  constructor(private formBuilder: FormBuilder,private router:Router,private usuarioService:UsuarioService,private utilidadService:UtilidadService) {
    this.formularioLogin = this.formBuilder.group({
      correo: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }
  iniciarsesion() {
    this.mostrarLoading =true;
    const request:Login ={
      correo:this.formularioLogin.value.correo,
      clave:this.formularioLogin.value.clave
    }
    this.usuarioService.iniciarSesion(request).subscribe({
      next:(data)=>{
        if(data.status){
          this.utilidadService.guardarSesionUsuario(data.value);
          this.router.navigate(['pages']);
        }
        else{
          this.mostrarLoading = false;
          this.utilidadService.mostraralerta("No se encontraron coincidencias","Opps!");
        }
      },
      complete:()=>{
        this.mostrarLoading = false;
      },
      error:()=>{
        this.mostrarLoading = false;
        this.utilidadService.mostraralerta("Hubo un error","Opps!");
      }
    })
  }
  togglePasswordVisibility() {
    this.ocultarpassword = !this.ocultarpassword;
  }
}
