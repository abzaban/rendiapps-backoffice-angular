import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth.routing';

import { SharedModule } from '../shared/shared.module';

import { AuthPage } from './auth-page.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';

@NgModule({
  declarations: [AuthPage, LoginComponent, RecoverPasswordComponent],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    AuthRoutingModule,
  ],
  providers: [],
  exports: [],
})
export class AuthModule { }
