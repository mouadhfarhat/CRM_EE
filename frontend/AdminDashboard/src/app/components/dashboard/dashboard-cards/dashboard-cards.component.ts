import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../../services/AdminDashboard/admin-dashboard.service';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent implements OnInit {
  totalFormations = 0;
  totalGroups = 0;
  totalClients = 0;
  totalCategories = 0;
  totalDemandes = 0;
  totalReclamationDemandes = 0;

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboardStats().subscribe((data: any) => {
      this.totalFormations = data.totalFormations;
      this.totalGroups = data.totalGroups;
      this.totalClients = data.totalClients;
      this.totalCategories = data.totalCategories;
      this.totalDemandes = data.totalDemandes;
      this.totalReclamationDemandes = data.totalReclamationDemandes;
    });
  }
}
