import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/interfaces/venta';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepicker } from '@angular/material/datepicker';

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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [{
    provide: MAT_DATE_FORMATS,
    useValue: MY_DATA_FORMATS
  }]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  formulariodeBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: "fecha", descripcion: "Por fechas" },
    { value: "numero", descripcion: "Numero venta" },
  ];
  picker1!: MatDatepicker<Date>;
  picker2!: MatDatepicker<Date>;
  displayedColumns: string[] = ['numeroDocumento', 'tipoPago', 'fechaRegistro', 'totalTexto', 'acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datainicio: Venta[] = [];
  datalistasVentas = new MatTableDataSource(this.datainicio);

  constructor(
    private ventaService: VentaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private utilidadService: UtilidadService
  ) {
    this.formulariodeBusqueda = this.formBuilder.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
    this.formulariodeBusqueda.get("buscarPor")?.valueChanges.subscribe(value => {
      this.formulariodeBusqueda.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: ""
      })
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.datalistasVentas.paginator = this.paginator;
    this.datalistasVentas.sort = this.sort;
  }

  aplicarFiltro(event: KeyboardEvent) {
    const valor = (event.target as HTMLInputElement).value;
    this.datalistasVentas.filter = valor.trim().toLowerCase();
  }

  buscarVentas() {
    let _fechainicio: string = "";
    let _fechaFin: string = "";

    if (this.formulariodeBusqueda.value.buscarPor === "fecha") {
      _fechainicio = moment(this.formulariodeBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formulariodeBusqueda.value.fechaFin).format('DD/MM/YYYY');
      if (!_fechainicio || !_fechaFin) {
        this.utilidadService.mostraralerta("Debes ingresar un formato valido", "Oops!");
        return;
      }
    }

    this.ventaService.Historial(
      this.formulariodeBusqueda.value.buscarPor,
      this.formulariodeBusqueda.value.numero,
      _fechainicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if (data.status) {
          this.datainicio = data.value;
          this.datalistasVentas.data = this.datainicio;
        } else {
          this.utilidadService.mostraralerta(data.msg, "Oops!");
        }
      },
      error: (error) => {
        this.utilidadService.mostraralerta(error.message, "Oops!");
      }
    });
  }

  abrirDetalleVenta(venta: Venta): void {
    this.dialog.open(ModalDetalleVentaComponent, {
      width: '700px',
      data: venta // Pasar los datos de la venta al abrir el diálogo
    });
  }

  Aplicarfiltrotabla(event: KeyboardEvent): void {
    const valor = (event.target as HTMLInputElement).value;
    this.datalistasVentas.filter = valor.trim().toLowerCase();
  }
}
