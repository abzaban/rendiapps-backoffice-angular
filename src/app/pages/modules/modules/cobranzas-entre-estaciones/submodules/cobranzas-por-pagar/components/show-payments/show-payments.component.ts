import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { CollectService } from '../../../../../../../../services/collect.service';

import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { EntityServiceModalData } from '../../../../../../../../interfaces/EntityServiceModalData';
import { CollectTable } from '../../../../interfaces/CollectTable';
import { Payment } from '../../../../interfaces/Payment';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'show-payments-component',
  templateUrl: './show-payments.component.html'
})
export class ShowPaymentsComponent implements AfterViewInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<Payment>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get tableColumns() {
    return this._tableColumns;
  }

  get dataSource() {
    return this._dataSource;
  }

  constructor(
    private _snackbarProvider: SnackbarProvider,
    private _dialogRef: MatDialogRef<ShowPaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityServiceModalData<CollectService, CollectTable>
  ) {
    console.log(this.data.entity.payments);
    this._tableColumns = ['id', 'amount', 'paymentDate', 'actions'];
    this._dataSource = new MatTableDataSource(this.data.entity.payments);
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  close() {
    this._dialogRef.close();
  }

  delete(paymentId: string) {
    this._snackbarProvider.openActionsSnackbar(
      'Eliminando pago',
      'red-snackbar',
      () => {
        this.data.service.deletePayment(this.data.entity.id, paymentId).subscribe((resp: DefaultResponse<null>) => {
          if (resp.error) {
            this._snackbarProvider.openNotifications(resp.msg, 'Error');
            return;
          }

          this._snackbarProvider.openNotifications(resp.msg, 'Success');
          this._dataSource.data = this._dataSource.data.filter(payment => payment.id != paymentId);
        });
      }
    );
  }
}
