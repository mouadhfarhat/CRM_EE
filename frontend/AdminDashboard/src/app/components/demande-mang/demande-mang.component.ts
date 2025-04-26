import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-demande-mang',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './demande-mang.component.html',
  styleUrl: './demande-mang.component.css',
})
export class DemandeMangComponent {

}
