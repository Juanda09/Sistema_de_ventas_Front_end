import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { Reporte } from 'src/app/interfaces/reporte';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepicker } from '@angular/material/datepicker';
import * as XLXS from "xlsx"

const COLUMN_DISPLAY_NAMES: { [key: string]: string } = {
  fechaRegistro: 'Fecha de registro',
  numeroDocumento: 'Numero de Orden',
  tipoPago: 'Tipo de Pago',
  total: 'Total',
  producto: 'Nombre del producto',
  cantidad: 'Cantidad',
  precio: 'Precio',
  totalVenta: 'Total de la Venta'
};

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM/YYYY',
  }
};
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [{
    provide: MAT_DATE_FORMATS,
    useValue: MY_DATA_FORMATS
  }]
})
export class ReporteComponent implements OnInit, AfterViewInit {
  formularioFiltro: FormGroup;
  listaventaReporte : Reporte[] =[];
  columnasTabla:string[] = ["fechaRegistro","numeroVenta","tipoPago","total","producto","cantidad","precio","totalProducto"];
  dataVentaReporte = new MatTableDataSource(this.listaventaReporte);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private fb:FormBuilder,
    private _ventaService:VentaService,
    private _utilidadService:UtilidadService
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio:["",Validators.required],
      fechaFin:["",Validators.required]
    })
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginator;
    this.dataVentaReporte.sort = this.sort;
  }
  buscarVentas(){
    let _fechainicio: string = "";
    let _fechaFin: string = "";
    _fechainicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');
    if (!_fechainicio || !_fechaFin) {
        this._utilidadService.mostraralerta("Debes ingresar un formato valido", "Oops!");
        return;
    }
    this._ventaService.Reporte(_fechainicio,_fechaFin).subscribe({
      next:(data)=>{
        if(data.status){
          this.listaventaReporte = data.value;
          this.dataVentaReporte.data = this.listaventaReporte;
        }
        else{
          this._utilidadService.mostraralerta(data.msg, "Oops!");
        }
      },
      error:(error)=>{
        this._utilidadService.mostraralerta(error.message, "Oops!");
      }
    })
  }
  exportarExcel() {
    // Verificar si los datos contienen todas las claves definidas en COLUMN_DISPLAY_NAMES
    const keysInData = Object.keys(this.listaventaReporte[0]); // Suponemos que al menos hay un elemento en listaventaReporte
    const keysInDisplayName = Object.keys(COLUMN_DISPLAY_NAMES);

    const missingKeys = keysInDisplayName.filter(key => !keysInData.includes(key));
    if (missingKeys.length > 0) {
      console.error(`Faltan las siguientes claves en los datos: ${missingKeys.join(', ')}`);
      return; // Detener la exportación si faltan claves
    }

    // Exportar los datos a Excel
    const wb = XLXS.utils.book_new();
    const ws = XLXS.utils.json_to_sheet(this.listaventaReporte.map((item: Reporte) => {
      const newItem: any = {};
      for (const key of Object.keys(item)) {
        const displayName = COLUMN_DISPLAY_NAMES[key];
        if (displayName) {
          newItem[displayName] = item[key as keyof Reporte];
        }
      }
      return newItem;
    }));
    XLXS.utils.book_append_sheet(wb, ws, 'Reporte');
    XLXS.writeFile(wb, 'Reporte ventas.xlsx');
  }



  Aplicarfiltrotabla(event: KeyboardEvent): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataVentaReporte.filter = valor.trim().toLowerCase();
  }


}
