import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { UsersPage } from './submodules/usuarios/users.page';
import { EnterprisesPage } from './submodules/empresas/enterprises.page';
import { StationsPage } from './submodules/estaciones/stations.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'usuarios',
    },
    {
        path: 'usuarios',
        component: UsersPage,
    },
    {
        path: 'empresas',
        component: EnterprisesPage
    },
    {
        path: 'estaciones',
        component: StationsPage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule { }
