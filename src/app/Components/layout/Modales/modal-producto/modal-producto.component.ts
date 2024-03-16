
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {
  formularioProducto: FormGroup;
  TituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  ListaCategorias: Categoria[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private utilidadService: UtilidadService
  ) {
    this.formularioProducto = this.formBuilder.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: [false] // Inicializamos con false, ya que es un mat-checkbox
    });


    if (this.datosProducto != null) {
      this.TituloAccion = "Editar";
      this.botonAccion = "Editar";
      this.patchDatosProducto();
    }
  }
  ngOnInit(): void {
    this.obtenerCategorias();
  }
  patchDatosProducto() {
    this.formularioProducto.patchValue({
      nombre: this.datosProducto.nombre,
      idCategoria: this.datosProducto.idCategoria,
      stock: this.datosProducto.stock,
      precio: this.datosProducto.precio,
      esActivo: this.datosProducto.esActivo
    });
  }
  guardarProducto() {
    // Obtener el valor del formulario
    const formData = this.formularioProducto.value;

    // Convertir el valor de esActivo a un número (1 si es true, 0 si es false)
    const esActivo = formData.esActivo ? 1 : 0;

    // Crear el objeto producto con el valor del formulario y el esActivo convertido
    const producto: Producto = {
      ...formData,
      esActivo: esActivo
    };

    // Llamar al servicio para guardar el producto
    this.productoService.guardarProductos(producto).subscribe({
      next: (response) => {
        if (response.status) {
          // Mostrar alerta de éxito
          this.utilidadService.mostraralerta("Producto creado exitosamente", "Éxito");
          // Cerrar el diálogo modal
          this.dialogRef.close();
        } else {
          // Mostrar alerta de error
          this.utilidadService.mostraralerta(response.msg, "Error");
        }
      },
      error: (error) => {
        console.error('Error al guardar producto:', error);
        // Mostrar alerta de error
        this.utilidadService.mostraralerta("Error al guardar producto", "Error");
      }
    });
  }
  actualizarProducto() {
    // Obtener el valor del formulario
    const formData = this.formularioProducto.value;

    // Convertir el valor de esActivo a un número (1 si es true, 0 si es false)
    const esActivo = formData.esActivo ? 1 : 0;

    // Crear el objeto producto con el valor del formulario y el esActivo convertido
    const producto: Producto = {
      ...formData,
      esActivo: esActivo
    };

    // Obtener el ID del producto a actualizar
    const id: number = this.datosProducto.idProducto;

    // Llamar al servicio para actualizar el producto
    this.productoService.actualizarProductos(producto, id).subscribe({
      next: (response) => {
        if (response.status) {
          // Mostrar alerta de éxito
          this.utilidadService.mostraralerta("Producto actualizado exitosamente", "Éxito");
          // Cerrar el diálogo modal
          this.dialogRef.close();
        } else {
          // Mostrar alerta de error
          this.utilidadService.mostraralerta(response.msg, "Error");
        }
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        // Mostrar alerta de error
        this.utilidadService.mostraralerta("Error al actualizar producto", "Error");
      }
    });
  }
  obtenerCategorias() {
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
  cerrarDialogo(): void {
    this.dialogRef.close();
  }
}


