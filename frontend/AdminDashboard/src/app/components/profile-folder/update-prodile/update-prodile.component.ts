import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-update-prodile',
  standalone: true,
  imports: [HttpClientModule
  ],
  templateUrl: './update-prodile.component.html',
  styleUrl: './update-prodile.component.css'
})
export class UpdateProdileComponent {

}
