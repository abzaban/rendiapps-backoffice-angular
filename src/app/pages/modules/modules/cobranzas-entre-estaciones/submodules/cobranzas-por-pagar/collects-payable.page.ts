import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';

import { Subject } from 'rxjs';

import { CollectService } from '../../../../../../services/collect.service';

import { MaxRangeSelectionStrategyProvider } from '../../../../../../providers/max-range-selection-strategy.provider';
import { FormatProvider } from '../../../../../../providers/format.provider';
import { ValidateProvider } from '../../../../../../providers/validate.provider';
import { DownloadProvider } from '../../../../../../providers/download.provider';
import { FilterProvider } from '../../../../../../providers/filter.provider';
import { SortProvider } from '../../../../../../providers/sort.provider';
import { SnackbarProvider } from '../../../../../../providers/snackbar.provider';

import { CustomEmit, DataFilter } from '../../../../../../shared/filter-input/interfaces/interfaces';
import { CustomSortTableAction } from '../../../../../../interfaces/CustomSortTableAction';
import { CollectTable } from '../../interfaces/CollectTable';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';
import { CrudTableAction } from '../../../../../../interfaces/CrudTableAction';
import { MatDialog } from '@angular/material/dialog';
import { ShowPaymentsComponent } from './components/show-payments/show-payments.component';
import { SavePaymentComponent } from './components/save-payment/save-payment.component';

@Component({
  selector: 'collects-payable-page',
  templateUrl: './collects-payable.page.html',
  providers: [
    { provide: 'rangeMax', useValue: 30 },
    { provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: MaxRangeSelectionStrategyProvider }
  ]
})
export class CollectsPayablePage implements OnInit {
  public maxDate: Date;

  private _rangeDateForm: FormGroup;
  private _msgDatepickerError: string;
  private _collects: CollectTable[];
  private _filteredCollects: CollectTable[];
  private _collects$: Subject<CollectTable[]>;
  public _stationsCollectNickNames!: DataFilter;
  public _stationsPayNickNames!: DataFilter;

  @ViewChild('collectsPaidCheckBox') collectsPaidCheckBox!: MatCheckbox;
  @ViewChild('stationsCollectNickNamesFilterInput') stationsCollectNickNamesFilterInput!: FilterInputComponent;
  @ViewChild('stationsPayNickNamesFilterInput') stationsPayNickNamesFilterInput!: FilterInputComponent;

  get rangeDateForm() {
    return this._rangeDateForm;
  }

  get msgDatepickerError() {
    return this._msgDatepickerError;
  }

  get collects() {
    return this._collects;
  }

  get filteredCollects() {
    return this._filteredCollects;
  }

  get collects$() {
    return this._collects$.asObservable();
  }

  get stationsCollectsNickNames() {
    return this._stationsCollectNickNames;
  }

  get stationsPayNickNames() {
    return this._stationsPayNickNames;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _collectService: CollectService,
    private _formatProvider: FormatProvider,
    private _validateProvider: ValidateProvider,
    private _downloadProvider: DownloadProvider,
    private _filterProvider: FilterProvider,
    private _sortProvider: SortProvider,
    private _snackbarProvider: SnackbarProvider
  ) {
    this.maxDate = new Date();

    this._rangeDateForm = this._formBuilder.group({
      start: [new Date(new Date().setMonth(new Date().getMonth() - 1))], // 1 month ago
      end: [this.maxDate] //today
    });

    this._msgDatepickerError = '';

    this._collects = this._filteredCollects = [];
    this._collects$ = new Subject();
  }

  ngOnInit() {
    this._collectService.getTableAdapterOfCollectsToPayInDateRange(
      this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('start')!.value),
      this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('end')!.value)
    ).subscribe((resp: DefaultResponse<CollectTable[]>) => {
      this._collects = this._filteredCollects = resp.error ? [] : resp.payload;
      this._collects$.next(this._filteredCollects);
      this.initStationsCollectFilter();
      this.initStationsPayFilter();
    });
  }

  validateDateRange() {
    this._msgDatepickerError = '';
    const datePickerErrors = this._rangeDateForm.get('end')!.errors;
    if (datePickerErrors)
      this._msgDatepickerError = this._validateProvider.getErrorMsg(datePickerErrors);
  }

  getCollectsByDateRange() {
    if (this._rangeDateForm.value['start'] == '' || this._rangeDateForm.value['end'] == '') {
      this._snackbarProvider.openNotifications('Ingrese un rango de fechas válido', 'Error');
      return;
    }

    this.collectsPaidCheckBox.checked = false;
    this.stationsCollectNickNamesFilterInput.dataCtrl.setValue(null);
    this.stationsPayNickNamesFilterInput.dataCtrl.setValue(null);

    this._collectService.getTableAdapterOfCollectsToPayInDateRange(
      this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('start')!.value),
      this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('end')!.value)
    ).subscribe((resp: DefaultResponse<CollectTable[]>) => {
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');

      this._collects = this._filteredCollects = resp.payload;
      this._collects$.next(resp.payload);
      this.initStationsCollectFilter();
      this.initStationsPayFilter();
    });
  }

  download(option: string) {
    let headers: string[] = [
      'ID',
      'Estación que cobra',
      'Estación que paga',
      'Estatus',
      'Monto',
      'Monto remanente',
      'Fecha de adeudo',
      'Fecha de registro'
    ];

    let itemsToExport: any[] = [];
    this._filteredCollects.forEach((element: CollectTable) => {
      itemsToExport.push([
        element.id,
        element.stationCollectNickName,
        element.stationPayNickName,
        element.status,
        element.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        element.amountRemaining.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        element.debitDate,
        element.created_at
      ]);
    });

    switch (option) {
      case 'pdf':
        this._downloadProvider.downloadPdf('Reporte de cobranzas', headers, itemsToExport);
        break;

      case 'xls':
        this._downloadProvider.downloadExcel('Reporte de cobranzas', headers, itemsToExport);
        break;
    }
  }

  initStationsCollectFilter() {
    let nickNames = this._collects
      .map((element: CollectTable) => {
        return element.stationCollectNickName;
      })
      .filter(
        (element: any, index: number, self) =>
          index === self.findIndex(
            (e) => e === element
          )
      );

    this._stationsCollectNickNames = {
      title: 'Estación que cobra',
      attribute: 'stationCollectNickName',
      items: nickNames,
      required: false,
      values: nickNames,
      initialValue: null
    }
  }

  initStationsPayFilter() {
    let nickNames = this._collects
      .map((element: CollectTable) => {
        return element.stationPayNickName;
      })
      .filter(
        (element: any, index: number, self) =>
          index === self.findIndex(
            (e) => e === element
          )
      );

    this._stationsPayNickNames = {
      title: 'Estación que paga',
      attribute: 'stationPayNickName',
      items: nickNames,
      required: false,
      values: nickNames,
      initialValue: null
    }
  }

  selectedItem(item: CustomEmit, event: MatCheckboxChange | null) {
    if (event instanceof MatCheckboxChange && !event.checked) {
      this.resetFilter();
      return;
    }

    let filteredData: CollectTable[] = [...this._collects];

    if (this.collectsPaidCheckBox.checked) {
      filteredData = this._filterProvider.filterByOneAttribute(
        'PAGADA',
        'status',
        filteredData
      );
    }

    if (this.stationsPayNickNamesFilterInput.dataCtrl.value)
      filteredData = this._filterProvider.filterByOneAttribute(
        this.stationsPayNickNamesFilterInput.dataCtrl.value,
        this.stationsPayNickNamesFilterInput.filter.attribute,
        filteredData
      );

    if (this.stationsCollectNickNamesFilterInput.dataCtrl.value)
      filteredData = this._filterProvider.filterByOneAttribute(
        this.stationsCollectNickNamesFilterInput.dataCtrl.value,
        this.stationsCollectNickNamesFilterInput.filter.attribute,
        filteredData
      );

    this._filteredCollects = filteredData;
    this._collects$.next(filteredData);
  }

  resetFilter() {
    this._filteredCollects = [...this._collects];
    this._collects$.next(this._collects);

    this.collectsPaidCheckBox.checked = false;
    this.stationsCollectNickNamesFilterInput.dataCtrl.setValue(null);
    this.stationsPayNickNamesFilterInput.dataCtrl.setValue(null);
  }

  sortColumn(sortTableAction: CustomSortTableAction) {
    this._collects$.next(this._sortProvider.sort(sortTableAction, this._filteredCollects))
  }

  emited(action: CrudTableAction) {
    switch (action.action) {
      case 'show-payments':
        this.showPayments(action.entityId);
        break;

      case 'create-payment':
        this.createPayment(action.entityId);
        break;
    }
  }

  showPayments(collectId: string) {
    const dialogRef = this._dialog.open(ShowPaymentsComponent, {
      disableClose: true,
      data: { service: this._collectService, entity: this._collects.filter(collect => collect.id == collectId)[0] }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._collectService.getTableAdapterOfCollectsToPayInDateRange(
        this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('start')!.value),
        this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('end')!.value)
      ).subscribe((resp: DefaultResponse<CollectTable[]>) => {
        this._collects = this._filteredCollects = resp.error ? [] : resp.payload;
        this._collects$.next(this._collects);

        this.stationsCollectNickNamesFilterInput.dataCtrl.setValue(null);
        this.stationsPayNickNamesFilterInput.dataCtrl.setValue(null);

        this.initStationsCollectFilter();
        this.initStationsPayFilter();
      });
    });
  }

  createPayment(collectId: string) {
    const dialogRef = this._dialog.open(SavePaymentComponent, {
      disableClose: true,
      data: { service: this._collectService, entityId: collectId }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._collectService.getTableAdapterOfCollectsToPayInDateRange(
        this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('start')!.value),
        this._formatProvider.dateObjToMDYString(this._rangeDateForm.get('end')!.value)
      ).subscribe((resp: DefaultResponse<CollectTable[]>) => {
        this._collects = this._filteredCollects = resp.error ? [] : resp.payload;
        this._collects$.next(this._collects);

        this.stationsCollectNickNamesFilterInput.dataCtrl.setValue(null);
        this.stationsPayNickNamesFilterInput.dataCtrl.setValue(null);

        this.initStationsCollectFilter();
        this.initStationsPayFilter();
      });
    });
  }
}
