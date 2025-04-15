import { Component } from '@angular/core';
import { GeoVisitorsComponent } from '../geo-visitors/geo-visitors.component';
import { StatisticListComponent } from '../statistic-list/statistic-list.component';
import { BrowserUsageComponent } from '../browser-usage/browser-usage.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { DirectChatComponent } from '../direct-chat/direct-chat.component';
import { LatestMembersComponent } from '../latest-members/latest-members.component';
import { TodolistComponent } from '../toDoList/Todolist.component';



@Component({
  selector: 'app-dashboard2',
  imports: [
    GeoVisitorsComponent,
    StatisticListComponent,
    BrowserUsageComponent,
    ProductListComponent, 
    DirectChatComponent, 
    LatestMembersComponent,
    TodolistComponent,
  ],
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.css',
  standalone:true
})
export class Dashboard2Component {

}