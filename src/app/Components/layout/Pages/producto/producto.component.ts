import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { Categoria } from 'src/app/interfaces/categoria';
import { CategoriaService } from'src/app/services/categoria.service';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'precio', 'descripcionCategoria', 'esActivo', 'acciones'];
  datalistasProductos = new MatTableDataSource<Producto>();
  datalistasProductosFiltrados = new MatTableDataSource<Producto>(); // Crear una instancia de MatTableDataSource para los productos filtrados
  categoriaSelecionada!: number; // Variable para almacenar la categoría seleccionada
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;;
  ListaCategorias: Categoria[]=[];

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoriaService: CategoriaService
  ) { }

  ngAfterViewInit(): void {
    this.cargarProductos();
    this.datalistasProductos.paginator = this.paginator;
    this.datalistasProductos.sort = this.sort;
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }
  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        if (data.status) {
          this.ListaCategorias = data.value;
        } else {
          console.error('Error al obtener categorías:', data.msg);
        }
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        if (data.status) {
          this.datalistasProductos.data = data.value;
        } else {
          this.mostrarError('Error al cargar productos: ' + data.msg);
        }
      },
      error: (error) => {
        this.mostrarError('Error al cargar productos: ' + error.message);
      }
    });
  }
  getColumnDisplayName(column: string): string {
    switch (column) {
      case 'nombre':
        return 'Nombre del Producto';
      case 'precio':
        return 'Precio';
      case 'descripcionCategoria':
        return 'Descripción de la Categoría';
      case 'esActivo':
        return 'Activo';
      case 'acciones':
        return 'Acciones'; // Las acciones no necesitan un nombre de columna
      default:
        return column; // Por defecto, mostrar el nombre de la columna tal como está en los datos
    }
    }
  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  abrirModalAgregarProducto(): void {
    const dialogRef = this.dialog.open(ModalProductoComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarProductos();
    });
  }

  abrirModalEditarProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(ModalProductoComponent, {
      width: '500px',
      data: producto
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarProductos();
    });
  }

  eliminarProducto(producto: Producto): void {
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
        this.productoService.eliminarProductos(producto.idProducto).subscribe({
          next: (response) => {
            if (response.status) {
              Swal.fire(
                'Eliminado!',
                'El producto ha sido eliminado.',
                'success'
              );
              this.cargarProductos();
            } else {
              this.mostrarError('Error al eliminar producto: ' + response.msg);
            }
          },
          error: (error) => {
            this.mostrarError('Error al eliminar producto: ' + error.message);
          }
        });
      }
    });
  }

  aplicarFiltro(event: KeyboardEvent) {
    const valor = (event.target as HTMLInputElement).value;
    this.datalistasProductos.filter = valor.trim().toLowerCase();
  }

  aplicarFiltroPorCategoria(): void {
    console.log(this.categoriaSelecionada)
    if (this.categoriaSelecionada) {
      const idCategoria = this.categoriaSelecionada;
      // Llamar al servicio para filtrar los productos por la categoría seleccionada
      this.productoService.getProductosPorCategoria(idCategoria).subscribe({
        next: (data) => {
          if (data.status) {
            // Asignar los productos filtrados al dataSource de la tabla
            this.datalistasProductosFiltrados.data = data.value;
          } else {
            this.mostrarError('Error al cargar productos: ' + data.msg);
          }
        },
        error: (error) => {
          this.mostrarError('Error al cargar productos: ' + error.message);
        }
      });
    } else {
      // Si no hay categoría seleccionada, mostrar todos los productos
      this.datalistasProductosFiltrados.data = this.datalistasProductos.data;
    }
    // Aplicar paginación y ordenamiento si es necesario
    this.datalistasProductosFiltrados.paginator = this.paginator;
    this.datalistasProductosFiltrados.sort = this.sort;
  }


}
