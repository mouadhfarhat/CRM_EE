import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DemandeService } from '../../../services/demande/demande.service';

@Component({
  selector: 'app-read-mail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './read-mail.component.html',
  styleUrl: './read-mail.component.css'
})
export class ReadMailComponent implements OnInit {

demande: any;

  constructor(private route: ActivatedRoute, private demandeService: DemandeService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.demandeService.getDemandeById(+id).subscribe(data => {
        this.demande = data;
      });
    }
  }
}
