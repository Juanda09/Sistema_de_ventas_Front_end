import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolService } from 'src/app/services/rol.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  TituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  ListaRoles: Rol[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuarios: Usuario,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private utilidadService: UtilidadService
  ) {
    this.formularioUsuario = this.formBuilder.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: [false] // Inicializamos con false, ya que es un mat-checkbox
    });

    if (this.datosUsuarios != null) {
      this.TituloAccion = "Editar";
      this.botonAccion = "Editar";
      this.patchDatosUsuario();
    }
  }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        if (data.status) {
          this.ListaRoles = data.value;
        } else {
          console.error('Error al obtener roles:', data.msg);
        }
      },
      error: (error) => {
        console.error('Error al obtener roles:', error);
      }
    });
  }

  patchDatosUsuario() {
    this.formularioUsuario.patchValue({
      nombreCompleto: this.datosUsuarios.nombreCompleto,
      correo: this.datosUsuarios.correo,
      idRol: this.datosUsuarios.idRol,
      clave: this.datosUsuarios.clave,
      esActivo: this.datosUsuarios.esActivo // No es necesario convertir a string
    });
  }

  guardarUsuario() {
    // Obtener el valor del formulario
    const formData = this.formularioUsuario.value;

    // Convertir el valor de esActivo a un número (1 si es true, 0 si es false)
    const esActivo = formData.esActivo ? 1 : 0;

    // Crear el objeto usuario con el valor del formulario y el esActivo convertido
    const usuario: Usuario = {
      ...formData,
      esActivo: esActivo
    };

    // Llamar al servicio para guardar el usuario
    this.usuarioService.guardar(usuario).subscribe({
      next: (response) => {
        if (response.status) {
          // Mostrar alerta de éxito
          this.utilidadService.mostraralerta("Usuario creado exitosamente", "Éxito");
          // Cerrar el diálogo modal
          this.dialogRef.close();
        } else {
          // Mostrar alerta de error
          this.utilidadService.mostraralerta(response.msg, "Error");
        }
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
        // Mostrar alerta de error
        this.utilidadService.mostraralerta("Error al guardar usuario", "Error");
      }
    });
  }


  actualizarUsuario() {
    // Obtener el valor del formulario
    const formData = this.formularioUsuario.value;

    // Convertir el valor de esActivo a un número (1 si es true, 0 si es false)
    const esActivo = formData.esActivo ? 1 : 0;

    // Crear el objeto usuario con el valor del formulario y el esActivo convertido
    const usuario: Usuario = {
      ...formData,
      esActivo: esActivo
    };

    // Obtener el ID del usuario a actualizar
    const id: number = this.datosUsuarios.idUsuario;

    // Llamar al servicio para actualizar el usuario
    this.usuarioService.actualizar(usuario, id).subscribe({
      next: (response) => {
        if (response.status) {
          // Mostrar alerta de éxito
          this.utilidadService.mostraralerta("Usuario actualizado exitosamente", "Éxito");
          // Cerrar el diálogo modal
          this.dialogRef.close();
        } else {
          // Mostrar alerta de error
          this.utilidadService.mostraralerta(response.msg, "Error");
        }
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        // Mostrar alerta de error
        this.utilidadService.mostraralerta("Error al actualizar usuario", "Error");
      }
    });
  }

  toggleOcultarPassword() {
    this.ocultarPassword = !this.ocultarPassword;
  }
}
