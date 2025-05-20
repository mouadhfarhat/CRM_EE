import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private baseUrl = 'http://localhost:8080/api/admin/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats() {
    return this.http.get(`${this.baseUrl}/cards`);
  }

  getMonthlyRevenue(startDate?: string, endDate?: string) {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.baseUrl}/revenue-per-month`, { params });
  }

  getDemandesOverTime() {
    return this.http.get(`${this.baseUrl}/demandes-over-time`);
  }

  getCategoryDistribution() {
    return this.http.get(`${this.baseUrl}/category-distribution`);
  }

  getFormationsPerFormateur() {
    return this.http.get(`${this.baseUrl}/formations-per-formateur`);
  }

getTopRevenueFormations(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/top-formations-revenue`);
}


  getDemandesByCategoryAndStatus() {
    return this.http.get(`${this.baseUrl}/demandes-by-category-status`);
  }

  getGestionnaireDemandeCount() {
    return this.http.get(`${this.baseUrl}/gestionnaire-demande-count`);
  }

  downloadRevenueCsv() {
    return this.http.get(`${this.baseUrl}/export/revenue.csv`, {
      responseType: 'blob',
    });
  }
}
