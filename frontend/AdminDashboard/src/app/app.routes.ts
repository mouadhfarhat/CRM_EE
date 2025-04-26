import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormationMangComponent } from './components/formation-mang/formation-mang.component';
import { ClientMangComponent } from './components/client-mang/client-mang.component';
import { GestionnaireMangComponent } from './components/gestionnaire-mang/gestionnaire-mang.component';
import { DemandeMangComponent } from './components/demande-mang/demande-mang.component';
import { ProfileComponent } from './components/profile-folder/profile/profile.component';
import { ClientInterfaceComponent } from './components/interface/client-interface/client-interface.component';
import { AdminInterfaceComponent } from './components/admin-interface/admin-interface.component';
import { MailboxComponent } from './components/mail/mailbox/mailbox.component';
import { ComposeMailComponent } from './components/mail/compose-mail/compose-mail.component';
import { ReadMailComponent } from './components/mail/read-mail/read-mail.component';
import { GereDemandeComponent } from './components/gere-demande/gere-demande.component';
import { ClientGestionnaireComponent } from './components/client-gestionnaire/client-gestionnaire.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
export const routes: Routes = [
         { path: 'login', component: LoginComponent },
         { path: 'admin', component: AdminInterfaceComponent },
         { path: 'formations', component: FormationMangComponent  },
         { path: 'clients', component: ClientMangComponent  },
         { path: 'demandes', component: DemandeMangComponent  },
         { path: 'gestionnaires', component: GestionnaireMangComponent  },
         { path: 'profile', component: ProfileComponent  },
         { path: '', component: ClientInterfaceComponent  },
         { path: 'mail',
           children: [
             { path: '', component: MailboxComponent },
             { path: 'compose/:email', component: ComposeMailComponent },
             { path: 'read/:id', component: ReadMailComponent },
           ]
         },
         { path: 'composeMail', component: ComposeMailComponent  },
         { path: 'readMail', component: ReadMailComponent  },
         { path: 'calendrier', component: CalendrierComponent  },
         { path: 'clientgest', component: ClientGestionnaireComponent  },
         { path: 'gere', component: GereDemandeComponent  },






];
