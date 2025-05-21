import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormationMangComponent } from './components/formation-mang/formation-mang.component';
import { ClientMangComponent } from './components/client-mang/client-mang.component';
import { GestionnaireMangComponent } from './components/gestionnaire-mang/gestionnaire-mang.component';
import { DemandeMangComponent } from './components/demande-mang/demande-mang.component';
import { ProfileComponent } from './components/profile-folder/profile/profile.component';
import { ClientInterfaceComponent } from './components/interface/client-interface/client-interface.component';
import { AdminInterfaceComponent } from './components/admin/admin-interface/admin-interface.component';
import { MailboxComponent } from './components/mail/mailbox/mailbox.component';
import { ComposeMailComponent } from './components/mail/compose-mail/compose-mail.component';
import { ReadMailComponent } from './components/mail/read-mail/read-mail.component';
import { GereDemandeComponent } from './components/gere-demande/gere-demande.component';
import { ClientGestionnaireComponent } from './components/client-gestionnaire/client-gestionnaire.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
import { GroupsComponent } from './components/admin/group/groups/groups.component';
import { AddGroupComponent } from './components/admin/group/add-group/add-group.component';
import { roleGuard } from './services/Roleguard/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Public & Client
  {
    path: '',
    component: ClientInterfaceComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [roleGuard(['CLIENT', 'VISITOR'])]
  },
  {
    path: 'composeMail',
    component: ComposeMailComponent,
    canActivate: [roleGuard(['CLIENT', 'VISITOR'])]
  },
  {
    path: 'readMail',
    component: ReadMailComponent,
    canActivate: [roleGuard(['CLIENT', 'VISITOR'])]
  },
  {
    path: 'mail',
    children: [
      { path: '', component: MailboxComponent, canActivate: [roleGuard(['CLIENT', 'VISITOR'])] },
      { path: 'compose/:email', component: ComposeMailComponent, canActivate: [roleGuard(['CLIENT', 'VISITOR'])] },
      { path: 'read/:id', component: ReadMailComponent, canActivate: [roleGuard(['CLIENT', 'VISITOR'])] },
    ]
  },

  // Gestionnaire & Admin
  {
    path: 'formations',
    component: FormationMangComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'clients',
    component: ClientMangComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'demandes',
    component: DemandeMangComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'gestionnaires',
    component: GestionnaireMangComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'admin',
    component: AdminInterfaceComponent,
    canActivate: [roleGuard(['ADMIN', 'GESTIONNAIRE'])]
  },
  {
    path: 'calendrier',
    component: CalendrierComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'clientgest',
    component: ClientGestionnaireComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'gere',
    component: GereDemandeComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },
  {
    path: 'addgroups',
    component: AddGroupComponent,
    canActivate: [roleGuard(['GESTIONNAIRE', 'ADMIN'])]
  },

  { path: 'profile/:id', component: ProfileComponent }, // optional: protect if needed

  { path: '**', redirectTo: '' }
];
