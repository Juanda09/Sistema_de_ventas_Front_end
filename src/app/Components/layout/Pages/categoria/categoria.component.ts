import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ModalCategoriaComponent } from '../../Modales/modal-categoria/modal-categoria.component';
import { Categoria } from 'src/app/interfaces/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'acciones'];
  datalistasCategorias = new MatTableDataSource<Categoria>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngAfterViewInit(): void {
    this.datalistasCategorias.paginator = this.paginator;
    this.datalistasCategorias.sort = this.sort;
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        if (data.status) {
          this.datalistasCategorias.data = data.value;
        } else {
          this.mostrarError('Error al cargar categorias: ' + data.msg);
        }
      },
      error: (error) => {
        this.mostrarError('Error al cargar categorias: ' + error.message);
      }
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  abrirModalAgregarCategoria(): void {
    const dialogRef = this.dialog.open(ModalCategoriaComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarCategorias();
    });
  }

  eliminarCategoria(categoria: Categoria): void {
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
        this.categoriaService.eliminarCategorias(categoria.idCategoria).subscribe({
          next: (response) => {
            if (response.status) {
              Swal.fire(
                'Eliminado!',
                'La categoría ha sido eliminada.',
                'success'
              );
              this.cargarCategorias();
            } else {
              this.mostrarError('Error al eliminar categoría: ' + response.msg);
            }
          },
          error: (error) => {
            this.mostrarError('Error al eliminar categoría: ' + error.message);
          }
        });
      }
    });
  }

  aplicarFiltro(event: KeyboardEvent): void {
    const valor = (event.target as HTMLInputElement).value;
    this.datalistasCategorias.filter = valor.trim().toLowerCase();
  }

  getColumnDisplayName(column: string): string {
    switch (column) {
      case 'nombre':
        return 'Nombre de la categoría';
      case 'acciones':
        return 'Acciones'; // Las acciones no necesitan un nombre de columna
      default:
        return column; // Por defecto, mostrar el nombre de la columna tal como está en los datos
    }
  }
}
