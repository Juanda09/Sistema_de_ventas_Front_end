import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'esActivo', 'acciones'];
  datalistasUsuarios = new MatTableDataSource<Usuario>();
  usuario!: Usuario;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewInit(): void {
    this.cargarUsuarios();
    this.datalistasUsuarios.paginator = this.paginator;
    this.datalistasUsuarios.sort = this.sort;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.datalistasUsuarios.data = data.value;
        } else {
          this.mostrarError('Error al cargar usuarios: ' + data.msg);
        }
      },
      error: (error) => {
        this.mostrarError('Error al cargar usuarios: ' + error.message);
      }
    });
  }

  abrirModalAgregarUsuario(): void {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarUsuarios();
    });
  }

  abrirModalEditarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '500px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (response) => {
            if (response.status) {
              Swal.fire(
                'Eliminado!',
                'El usuario ha sido eliminado.',
                'success'
              );
              this.cargarUsuarios();
            } else {
              this.mostrarError('Error al eliminar usuario: ' + response.msg);
            }
          },
          error: (error) => {
            this.mostrarError('Error al eliminar usuario: ' + error.message);
          }
        });
      }
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
  getColumnDisplayName(column: string): string {
    switch (column) {
      case 'nombreCompleto':
        return 'Nombre Completo';
      case 'correo':
        return 'Correo Electrónico';
      case 'rolDescripcion':
        return 'Rol';
      case 'esActivo':
        return 'Activo';
      case 'acciones':
        return 'Acciones'; // Las acciones no necesitan un nombre de columna
      default:
        return column; // Por defecto, mostrar el nombre de la columna tal como está en los datos
    }
  }

}
