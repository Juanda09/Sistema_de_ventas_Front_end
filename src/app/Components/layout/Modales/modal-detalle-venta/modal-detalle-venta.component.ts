import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {
  fechaRegistro: string = "";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string = "";
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ["producto", "cantidad", "precio", "total"];

  constructor(@Inject(MAT_DIALOG_DATA) public datosventa: Venta) {
    console.log(datosventa); // Verifica los datos recibidos en la consola
    // Asigna los datos recibidos a las propiedades del componente
    this.fechaRegistro = datosventa.fechaRegistro || "";
    console.log(this.fechaRegistro);
    this.numeroDocumento = datosventa.numeroDocumento || "";
    this.tipoPago = datosventa.tipoPago || "";
    console.log(this.tipoPago);
    this.total = datosventa.totalTexto || "";
    this.detalleVenta = datosventa.detalleVenta || [];
    console.log(this.detalleVenta);
  }

  ngOnInit(): void {
  }
}
