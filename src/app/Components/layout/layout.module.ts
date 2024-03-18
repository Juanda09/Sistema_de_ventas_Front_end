import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { CategoriaComponent } from './Pages/categoria/categoria.component';
import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalCategoriaComponent } from './Modales/modal-categoria/modal-categoria.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    CategoriaComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalCategoriaComponent,
    ModalDetalleVentaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // Agrega FormsModule a los imports
    LayoutRoutingModule,
    SharedModule,
    MatDatepickerModule
  ]
})
export class LayoutModule { }
