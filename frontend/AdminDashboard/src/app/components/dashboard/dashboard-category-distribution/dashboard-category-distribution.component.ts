import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { AdminDashboardService } from '../../../services/AdminDashboard/admin-dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-category-distribution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-category-distribution.component.html',
  styleUrl: './dashboard-category-distribution.component.css'
})
export class DashboardCategoryDistributionComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('formationsChart') formationsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topRevenueChart') topRevenueChartRef!: ElementRef<HTMLCanvasElement>;

  private categoryChart!: Chart;
  private formationsChart!: Chart;
  private topRevenueChart!: Chart;

  showTopRevenueChart = false;

  private adminDashboardService = inject(AdminDashboardService);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadCategoryDistributionChart();
    this.loadFormationsPerFormateurChart();
    // Top revenue chart loads only on toggle
  }

  toggleRevenueChart(): void {
    this.showTopRevenueChart = !this.showTopRevenueChart;

    if (this.showTopRevenueChart) {
      if (this.formationsChart) {
        this.formationsChart.destroy();
      }
      this.loadTopRevenueFormationsChart();
    } else {
      if (this.topRevenueChart) {
        this.topRevenueChart.destroy();
      }
      this.loadFormationsPerFormateurChart();
    }
  }

  loadCategoryDistributionChart(): void {
    this.adminDashboardService.getCategoryDistribution().subscribe((data: Object) => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Répartition par catégorie',
            data: values,
            backgroundColor: this.generateColors(labels.length)
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: 'white' } // Legend text color
            },
            tooltip: {
              bodyColor: 'white',
              titleColor: 'white'
            }
          }
        }
      });
    });
  }

  loadFormationsPerFormateurChart(): void {
    this.adminDashboardService.getFormationsPerFormateur().subscribe((data: Object) => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.formationsChart = new Chart(this.formationsChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Formations par formateur',
            data: values,
            backgroundColor: '#FF7043'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              bodyColor: 'white',
              titleColor: 'white'
            }
          },
          scales: {
            x: {
              ticks: { color: 'white' } // X-axis labels color
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: 'white'  // Y-axis labels color
              }
            }
          }
        }
      });
    });
  }

  loadTopRevenueFormationsChart(): void {
    this.adminDashboardService.getTopRevenueFormations().subscribe((data: any[]) => {
      const labels = data.map(item => item.title);
      const values = data.map(item => item.revenue);

      if (this.topRevenueChart) {
        this.topRevenueChart.destroy();
      }

      this.topRevenueChart = new Chart(this.topRevenueChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Formations à haut revenu',
            data: values,
            backgroundColor: this.generateColors(labels.length)
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: 'white' } // Legend text color
            },
            tooltip: {
              bodyColor: 'white',
              titleColor: 'white'
            }
          }
        }
      });
    });
  }

  private generateColors(count: number): string[] {
    const baseColors = [
      '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#26A69A',
      '#EF5350', '#EC407A', '#8D6E63', '#78909C', '#D4E157'
    ];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  }
}
