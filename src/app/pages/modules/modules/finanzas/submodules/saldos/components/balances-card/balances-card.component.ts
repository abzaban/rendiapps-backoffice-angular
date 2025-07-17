import { Component, Input, AfterContentInit } from '@angular/core';

import { WalletTable } from '../../../../interfaces/WalletTable';

@Component({
    selector: 'balances-card-component',
    templateUrl: './balances-card.component.html',
    styleUrls: ['./balances-card.component.scss']
})
export class BalancesCardComponent implements AfterContentInit {
    @Input() wallet!: WalletTable;

    constructor() {
    }

    ngAfterContentInit(): void {
        console.log(this.wallet)
    }
}
