import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { AdminDashboardService } from '../../../services/AdminDashboard/admin-dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-charts.component.html',
  styleUrl: './dashboard-charts.component.css'
})
export class DashboardChartsComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('demandesChart') demandesChartRef!: ElementRef<HTMLCanvasElement>;

  private revenueChart!: Chart;
  private demandesChart!: Chart;

  private adminDashboardService = inject(AdminDashboardService);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadRevenueChart();
    this.loadDemandesChart();
  }

  loadRevenueChart(): void {
    const allMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const defaultData: { [key: string]: number } = {};
    allMonths.forEach(month => defaultData[month] = 0);

    this.adminDashboardService.getMonthlyRevenue().subscribe(data => {
      Object.entries(data).forEach(([month, value]) => {
        defaultData[month] = value;
      });

      const values = allMonths.map(month => defaultData[month]);

      this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: allMonths,
          datasets: [{
            label: 'Revenu ($)',
            data: values,
            backgroundColor: '#42A5F5'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'white' // Legend text color
              }
            },
            tooltip: {
              bodyColor: 'white',
              titleColor: 'white'
            }
          },
          scales: {
            x: {
              ticks: { color: 'white' } // X-axis label color
            },
            y: {
              beginAtZero: true,
              ticks: { color: 'white' }
            }
          }
        }
      });
    });
  }

  loadDemandesChart(): void {
    const allMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const defaultData: { [key: string]: number } = {};
    allMonths.forEach(month => defaultData[month] = 0);

    this.adminDashboardService.getDemandesOverTime().subscribe(data => {
      Object.entries(data).forEach(([month, stats]) => {
        defaultData[month] = stats.TERMINE;
      });

      const values = allMonths.map(month => defaultData[month]);

      this.demandesChart = new Chart(this.demandesChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: allMonths,
          datasets: [{
            label: 'Demandes Terminées',
            data: values,
            backgroundColor: '#66BB6A'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'white' // Legend text color
              }
            },
            tooltip: {
              bodyColor: 'white',
              titleColor: 'white'
            }
          },
          scales: {
            x: {
              ticks: { color: 'white' }
            },
            y: {
              beginAtZero: true,
              ticks: { color: 'white' }
            }
          }
        }
      });
    });
  }
}
