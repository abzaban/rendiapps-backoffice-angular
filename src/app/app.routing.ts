import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { HomeRoutingModule } from './pages/pages.routing';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio/modulos',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NopagefoundComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    }),
    AuthRoutingModule,
    HomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
