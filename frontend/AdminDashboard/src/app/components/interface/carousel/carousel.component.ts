import { Component, Input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Formation } from '../../../domains/formation';
import { FormationService } from '../../../services/formation/formation.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {

  
}
