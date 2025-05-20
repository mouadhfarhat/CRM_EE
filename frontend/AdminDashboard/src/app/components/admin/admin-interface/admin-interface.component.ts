import { Component } from '@angular/core';
import { DashboardCardsComponent } from '../../dashboard/dashboard-cards/dashboard-cards.component';
import { DashboardChartsComponent } from '../../dashboard/dashboard-charts/dashboard-charts.component';
import { DashboardCategoryDistributionComponent } from '../../dashboard/dashboard-category-distribution/dashboard-category-distribution.component';
import { DashboardCategoryStatusComponent } from '../../dashboard/dashboard-category-status/dashboard-category-status.component';
import { DashboardGestionnaireCountComponent } from '../../dashboard/dashboard-gestionnaire-count/dashboard-gestionnaire-count.component';

// Import all child standalone components

@Component({
  selector: 'app-admin-interface',
  standalone: true,
  imports: [
    DashboardCardsComponent,
    DashboardChartsComponent,
    DashboardCategoryDistributionComponent,

    DashboardCategoryStatusComponent,
    DashboardGestionnaireCountComponent
  ],
  templateUrl: './admin-interface.component.html',
  styleUrls: ['./admin-interface.component.css']
})
export class AdminInterfaceComponent {}
