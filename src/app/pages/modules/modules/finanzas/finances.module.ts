import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { WalletsPage } from './submodules/carteras/wallets.page';
import { WalletsTableComponent } from './submodules/carteras/components/wallets-table/wallets-table.component';
import { ToggleAddEditAccountComponent } from './submodules/carteras/components/toggle-add-edit-account/toggle-add-edit-account.component';
import { ShowAccountsComponent } from './submodules/carteras/components/show-accounts/show-accounts.component';

import { BalancesPage } from './submodules/saldos/balances.page';
import { BalancesCardComponent } from './submodules/saldos/components/balances-card/balances-card.component';

@NgModule({
    declarations: [
        // submodule balances
        BalancesPage,
        BalancesCardComponent,

        // submodule wallets
        WalletsPage,
        WalletsTableComponent,
        ToggleAddEditAccountComponent,
        ShowAccountsComponent
    ],
    imports: [SharedModule],
})
export class FinancesModule { }
