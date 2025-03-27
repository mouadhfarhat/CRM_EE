import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CrmFrontend';
  formations = [  // Static formations data
    {
      id: 1,
      titre: 'Formation Angular',
      description: 'Apprendre Angular pour développer des applications web.',
      dateDebut: '2023-04-10',
      dateFin: '2023-04-20',
      domaine: 'Développement Web',
      image: 'angular.jpg',  // Replace with actual image name if required
      inventoryStatus: 'INSTOCK',
      rating: 4.5,
      category: 'Web Development',
      price: 100
    },
    {
      id: 2,
      titre: 'Formation Java Spring',
      description: 'Maîtriser le framework Java Spring pour créer des API.',
      dateDebut: '2023-05-15',
      dateFin: '2023-05-25',
      domaine: 'Développement Backend',
      image: 'spring.jpg',  // Replace with actual image name if required
      inventoryStatus: 'INSTOCK',
      rating: 4.8,
      category: 'Backend Development',
      price: 150
    },
    {
      id: 3,
      titre: 'Formation React',
      description: 'Apprenez à créer des applications dynamiques avec React.',
      dateDebut: '2023-06-01',
      dateFin: '2023-06-10',
      domaine: 'Développement Frontend',
      image: 'react.jpg',  // Replace with actual image name if required
      inventoryStatus: 'OUTOFSTOCK',
      rating: 4.2,
      category: 'Frontend Development',
      price: 120
    }
  ];

  layout: string = 'list';  // Default layout (list view)
  options = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' }
  ];
}

