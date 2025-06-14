import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent} from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatComponent } from './components/chatbot/chat/chat.component';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent, ChatComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone:true
})
export class AppComponent {
  title = 'AdminDashboard';
}
