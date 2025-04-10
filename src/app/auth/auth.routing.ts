import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';

import { AuthPage } from './auth-page.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';

const routes: Routes = [
    {
        path: 'autenticacion',
        component: AuthPage,

        children: [
            {
                path: '',
                component: LoginComponent,
                data: { animation: 'loginFade' },
            },
            {
                path: 'recuperar-contraseña',
                component: RecoverPasswordComponent,
                data: { animation: 'recoverPasswordFade' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }