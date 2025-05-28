import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsPage } from './submodules/carteras/wallets.page';

import { BalancesPage } from './submodules/saldos/balances.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'carteras',
    },
    {
        path: 'carteras',
        component: WalletsPage,
    },
    {
        path: 'saldos',
        component: BalancesPage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FinancesRoutingModule { }
