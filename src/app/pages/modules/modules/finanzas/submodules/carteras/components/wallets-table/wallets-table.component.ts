import { Component, AfterViewInit, Input, ViewChild, AfterContentInit, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';

import { CustomSortTableAction } from '../../../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../../../interfaces/CrudTableAction';
import { WalletTable } from '../../../../interfaces/WalletTable';

@Component({
  selector: 'wallets-table-component',
  templateUrl: './wallets-table.component.html'
})
export class WalletsTableComponent implements AfterViewInit, AfterContentInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<WalletTable>;

  @Input() wallets!: Observable<WalletTable[]>;
  @Output() sortTableAction: EventEmitter<CustomSortTableAction>;
  @Output() walletAction: EventEmitter<CrudTableAction>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get tableColumns() {
    return this._tableColumns;
  }

  get dataSource() {
    return this._dataSource;
  }

  constructor() {
    this._tableColumns = ['id', 'ownerNickName', 'actions'];

    this._dataSource = new MatTableDataSource();

    this.sortTableAction = new EventEmitter<CustomSortTableAction>();

    this.walletAction = new EventEmitter<CrudTableAction>();
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.wallets.subscribe((wallets: WalletTable[]) => {
      this._dataSource.data = wallets;
    });
  }

  announceSortChange(sortTableAction: Sort) {
    this.sortTableAction.emit({
      active: sortTableAction.active,
      direction: sortTableAction.direction,
      isDate: false
    });
  }

  showAccounts(walletId: string) {
    this.walletAction.emit({ action: 'show-accounts', entityId: walletId });
  }
}
