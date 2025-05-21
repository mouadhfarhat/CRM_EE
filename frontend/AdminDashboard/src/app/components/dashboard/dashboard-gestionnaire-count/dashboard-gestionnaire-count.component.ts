import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-gestionnaire-count',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-gestionnaire-count.component.html',
  styleUrl: './dashboard-gestionnaire-count.component.css'
})
export class DashboardGestionnaireCountComponent {
  constructor(private http: HttpClient) {}

  downloadRevenueCsv(): void {
    const url = 'http://localhost:8080/api/admin/dashboard/export/revenue.csv';

    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'revenue.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
