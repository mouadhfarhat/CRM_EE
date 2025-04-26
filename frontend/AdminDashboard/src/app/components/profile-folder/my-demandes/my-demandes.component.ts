import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
@Component({
  selector: 'app-my-demandes',
  standalone: true,
  imports: [HttpClientModule
,    FormsModule, RatingModule,CommonModule],
  templateUrl: './my-demandes.component.html',
  styleUrl: './my-demandes.component.css'
})
export class MyDemandesComponent {

  value!: number;
  // Sample list of demandes, you can replace this with your actual data
  demandes = [
    { title: 'Demande 1', type: 'Administrative', status: 'received', createdDate: '01.01.2019' },
    { title: 'Demande 2', type: 'Reclamative', status: 'in progress', createdDate: '02.02.2020' },
    { title: 'Demande 3', type: 'Reclamative', status: 'treated', createdDate: '02.02.2020' }

];

// Array to store the ratings for each demande
ratings: number[] = [0, 0]; // Initialize with the same number of entries as your demandes
}




