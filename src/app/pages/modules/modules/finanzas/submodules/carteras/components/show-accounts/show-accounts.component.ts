import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ToggleAddEditAccountComponent } from '../toggle-add-edit-account/toggle-add-edit-account.component';

import { WalletService } from '../../../../../../../../services/wallet.service';

import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { EntityServiceModalData } from '../../../../../../../../interfaces/EntityServiceModalData';
import { Wallet } from '../../../../interfaces/Wallet';
import { WalletTable } from '../../../../interfaces/WalletTable';
import { Account } from '../../../../interfaces/Account';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'show-accounts-component',
  templateUrl: './show-accounts.component.html'
})
export class ShowAccountsComponent implements AfterViewInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<Account>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get tableColumns() {
    return this._tableColumns;
  }

  get dataSource() {
    return this._dataSource;
  }

  constructor(
    private _dialog: MatDialog,
    private _snackbarProvider: SnackbarProvider,
    private _dialogRef: MatDialogRef<ShowAccountsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityServiceModalData<WalletService, WalletTable>
  ) {
    this._tableColumns = ['id', 'bankName', 'accountNumber', 'actions'];
    this._dataSource = new MatTableDataSource(this.data.entity.accounts);
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  openEditModal(account: Account) {
    const dialogRef = this._dialog.open(ToggleAddEditAccountComponent, {
      disableClose: true,
      data: { service: this.data.service, entity: account, ownerId: this.data.entity.id }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.data.service.get(this.data.entity.id).subscribe((resp: DefaultResponse<Wallet>) => {
        this._dataSource.data = resp.payload.accounts;
      })
    });
  }

  delete(accountId: string) {
    this._snackbarProvider.openActionsSnackbar(
      'Eliminando cuenta',
      'red-snackbar',
      () => {
        this.data.service.deleteAccount(this.data.entity.id, accountId).subscribe((resp: DefaultResponse<null>) => {
          if (resp.error) {
            this._snackbarProvider.openNotifications(resp.msg, 'Error');
            return;
          }

          this._snackbarProvider.openNotifications(resp.msg, 'Success');
          this._dataSource.data = this._dataSource.data.filter(account => account.id != accountId);
        });
      }
    );
  }

  close() {
    this._dialogRef.close();
  }
}
