import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ValidateTokenGuard } from '../guards/validate-token.guard';

import { PagesPage } from './pages.page';
import { ProfilePage } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: PagesPage,
    canActivate: [ValidateTokenGuard],
    children: [
      {
        path: 'modulos',
        loadChildren: () => import('./modules/modules.routing').then((m) => m.ModulesRoutingModule)
      },
      {
        path: 'perfil',
        component: ProfilePage
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
