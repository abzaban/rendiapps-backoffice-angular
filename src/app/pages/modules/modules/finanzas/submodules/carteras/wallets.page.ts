import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';
import { ToggleAddEditAccountComponent } from './components/toggle-add-edit-account/toggle-add-edit-account.component';
import { ShowAccountsComponent } from './components/show-accounts/show-accounts.component';

import { WalletService } from '../../../../../../services/wallet.service';

import { FilterProvider } from '../../../../../../providers/filter.provider';
import { SortProvider } from '../../../../../../providers/sort.provider';

import { CustomEmit, DataFilter } from '../../../../../../shared/filter-input/interfaces/interfaces';
import { CustomSortTableAction } from '../../../../../../interfaces/CustomSortTableAction';
import { WalletTable } from '../../interfaces/WalletTable';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'wallets-page',
  templateUrl: './wallets.page.html'
})
export class WalletsPage implements OnInit {
  private _wallets: WalletTable[];
  private _wallets$: Subject<WalletTable[]>;
  private _ownersNickNames!: DataFilter;

  @ViewChild('ownersNickNamesFilterInput') ownersNickNamesFilterInput!: FilterInputComponent;

  get wallets() {
    return this._wallets;
  }

  get wallets$() {
    return this._wallets$.asObservable();
  }

  get ownersNickNames() {
    return this._ownersNickNames;
  }

  constructor(
    private _walletservice: WalletService,
    private _filterProvider: FilterProvider,
    private _sortProvider: SortProvider,
    private _dialog: MatDialog
  ) {
    this._wallets = [];
    this._wallets$ = new Subject();
  }

  ngOnInit() {
    this._walletservice.getTableAdapter().subscribe((resp: DefaultResponse<WalletTable[]>) => {
      this._wallets = resp.error ? [] : resp.payload;
      this._wallets$.next(this._wallets);
      this.initFilter();
    });
  }

  initFilter() {
    let nickNames = this._wallets.map((element: WalletTable) => { return element.ownerNickName; });
    this._ownersNickNames = {
      title: 'Propietario',
      attribute: 'ownerNickName',
      items: nickNames,
      required: false,
      values: nickNames,
      initialValue: null
    }
  }

  selectedItem(item: CustomEmit) {
    this._wallets$.next(this._filterProvider.filterByOneAttribute(item.item, item.attribute, this._wallets));
  }

  resetFilter() {
    this._wallets$.next(this._wallets);
    this.ownersNickNamesFilterInput.dataCtrl.setValue('');
  }

  sortColumn(sortTableAction: CustomSortTableAction) {
    this._wallets$.next(this._sortProvider.sort(sortTableAction, this._wallets))
    this.ownersNickNamesFilterInput.dataCtrl.setValue('');
  }

  openAddModal() {
    const dialogRef = this._dialog.open(ToggleAddEditAccountComponent, {
      disableClose: true,
      data: { service: this._walletservice, entity: null, ownerId: null }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._walletservice.getTableAdapter().subscribe((resp: DefaultResponse<WalletTable[]>) => {
        console.log(resp)
        this._wallets = resp.payload;
        this._wallets$.next(this._wallets);
        this.ownersNickNamesFilterInput.dataCtrl.setValue('');
        this.initFilter();
      });
    });
  }

  openAccountsModal(walletId: string) {
    const dialogRef = this._dialog.open(ShowAccountsComponent, {
      disableClose: true,
      data: { service: this._walletservice, entity: this.wallets.filter(wallet => wallet.id == walletId)[0] }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._walletservice.getTableAdapter().subscribe((resp: DefaultResponse<WalletTable[]>) => {
        this._wallets = resp.payload;
        this._wallets$.next(resp.payload);
        this.ownersNickNamesFilterInput.dataCtrl.setValue('');
        this.initFilter();
      });
    });
  }
}
