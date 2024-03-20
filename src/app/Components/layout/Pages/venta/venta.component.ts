import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { Producto } from 'src/app/interfaces/producto';
import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  listaProductos: Producto[] = [];
  listaProductoFiltros: Producto[] = [];
  listaProductoParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;
  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ["producto", "cantidad", "precio", "total", "accion"];
  datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductoParaVenta);

  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private ventaService: VentaService,
    private utilidadService: UtilidadService
  ) {
    this.formularioProductoVenta = this.formBuilder.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe(
      (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error => {
        console.error(error);
      }
    );

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductoFiltros = this.retornarProductosPorFiltro(value);
    });
  }

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(producto => producto.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  mostrarProductos(producto: Producto): string {
    return producto.nombre;
  }

  ProductoParaVenta(event: any): void {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(): void {
    let _cantidad: number = this.formularioProductoVenta.value.cantidad;
    if (_cantidad <= 0) {
      _cantidad = 1; // Restablecer la cantidad a 1 si es menor o igual a 0
      this.formularioProductoVenta.patchValue({ cantidad: _cantidad }); // Actualizar el valor en el formulario
    }
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar += _total;
    this.listaProductoParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: _precio.toFixed(2),
      totalTexto: _total.toFixed(2)
    });
    this.datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductoParaVenta);
    this.formularioProductoVenta.patchValue({
      producto: "",
      cantidad: "",
    });
  }

  eliminarProducto(detalle: DetalleVenta): void {
    this.totalPagar -= parseFloat(detalle.totalTexto);
    this.listaProductoParaVenta = this.listaProductoParaVenta.filter(p => p.idProducto != detalle.idProducto);
    this.datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductoParaVenta);
  }

  registrarVenta(): void {
    if (this.listaProductoParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;
      const request: Venta = {
        tipoPago: this.tipoPagoPorDefecto,
        totalTexto: this.totalPagar.toFixed(2),
        detalleVenta: this.listaProductoParaVenta
      };
      this.ventaService.Registrar(request).subscribe({
        next: (data) => {
          if (data.status) {
            this.totalPagar = 0.00;
            this.listaProductoParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductoParaVenta);
          }
          Swal.fire({
            icon: 'success',
            title: data.msg,
            showConfirmButton: false,
            text: "Numero de venta" + data.value.numeroDocumento,
            timer: 1500
          });
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        }
      });
    } else {
      this.utilidadService.mostraralerta("No se puede hacer la venta", "Oops!");
    }
  }
}
