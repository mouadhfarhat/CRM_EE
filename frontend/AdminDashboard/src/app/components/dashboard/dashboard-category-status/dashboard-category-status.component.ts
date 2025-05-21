import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../../services/AdminDashboard/admin-dashboard.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-category-status',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard-category-status.component.html',
  styleUrl: './dashboard-category-status.component.css'
})
export class DashboardCategoryStatusComponent implements OnInit {
  @ViewChild('categoryStatusChart') categoryStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gestionnaireChart') gestionnaireChartRef!: ElementRef<HTMLCanvasElement>;

  private adminDashboardService = inject(AdminDashboardService);
  private categoryStatusChart!: Chart;
  private gestionnaireChart!: Chart;

  statutList = ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'REFUSE'];
  selectedStatus: string = 'TERMINE';

  ngOnInit(): void {
    setTimeout(() => {
      this.loadCategoryStatusChart();
      this.loadGestionnaireDemandeChart();
    });
  }

  loadCategoryStatusChart(): void {
    this.adminDashboardService.getDemandesByCategoryAndStatus().subscribe((data: any) => {
      const labels = Object.keys(data);
      const values = labels.map(label => data[label][this.selectedStatus] || 0);

      if (this.categoryStatusChart) {
        this.categoryStatusChart.destroy(); // Clear previous chart
      }

      this.categoryStatusChart = new Chart(this.categoryStatusChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: `Demandes ${this.selectedStatus.replace('_', ' ')}`,
            data: values,
            backgroundColor: '#42A5F5'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });
    });
  }
loadGestionnaireDemandeChart(): void {
  this.adminDashboardService.getGestionnaireDemandeCount().subscribe((data: any) => {
    const labels = Object.keys(data);
    const values = Object.values(data) as number[];

    this.gestionnaireChart = new Chart(this.gestionnaireChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Demandes par Gestionnaire',
          data: values,
          backgroundColor: '#66BB6A'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  });
}

}
