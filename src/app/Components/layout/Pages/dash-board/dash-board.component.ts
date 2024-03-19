import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/services/dash-board.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  totalingresos: string = "0";
  totalventas: string = "0";
  totalproductos: string = "0";

  constructor(private dashBoardService: DashBoardService) { }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    const chartBarras = new Chart("chartBarras", {
      type: "bar",
      data: {
        labels: labelGrafico,
        datasets: [
          {
            label: "# de Ventas",
            data: dataGrafico,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.dashBoardService.Resumen().subscribe({
      next: (data) => {
        if (data.status) {
          // Convertir a números y luego formatear
          this.totalingresos = parseFloat(data.value.totalIngresos).toLocaleString('es-CO');
          this.totalventas = parseFloat(data.value.totalVentas).toLocaleString('es-CO');
          this.totalproductos = parseFloat(data.value.totalProductos).toLocaleString('es-CO');
          const arrayData: any[] = data.value.ventasUltimaSemana;
          console.log(arrayData);
          const labeltemp = arrayData.map((value) => value.fecha);
          const datatemp = arrayData.map((value) => value.total);
          console.log(labeltemp, datatemp);
          this.mostrarGrafico(labeltemp, datatemp);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
