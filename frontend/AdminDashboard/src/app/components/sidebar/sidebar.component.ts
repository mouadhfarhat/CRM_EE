import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../services/role/role.service';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone:true
})
export class SidebarComponent {

  role: string = 'visitor';

  constructor(private roleService: RoleService) {
    this.roleService.role$.subscribe((r) => (this.role = r));
  }

}
