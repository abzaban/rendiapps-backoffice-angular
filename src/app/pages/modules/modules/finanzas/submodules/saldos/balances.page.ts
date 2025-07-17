import { Component, OnInit, ViewChild } from '@angular/core';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';

import { WalletService } from '../../../../../../services/wallet.service';

import { WalletTable } from '../../interfaces/WalletTable';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'balances-page',
  templateUrl: './balances.page.html'
})
export class BalancesPage implements OnInit {
  private _wallets: WalletTable[];

  @ViewChild('nickNamesFilter') nicknamesFilterInput!: FilterInputComponent;

  get wallets() {
    return this._wallets;
  }

  constructor(
    private _walletservice: WalletService,
  ) {
    this._wallets = [];
  }

  ngOnInit() {
    this._walletservice.getTableAdapter().subscribe((resp: DefaultResponse<WalletTable[]>) => {
      this._wallets = resp.error ? [] : resp.payload;
    });
  }
}
