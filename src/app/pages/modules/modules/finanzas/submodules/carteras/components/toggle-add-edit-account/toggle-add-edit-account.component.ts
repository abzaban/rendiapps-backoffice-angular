import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { StationService } from '../../../../../../../../services/station.service';
import { EnterpriseService } from '../../../../../../../../services/enterprise.service';

import { ValidateProvider } from '../../../../../../../../providers/validate.provider';
import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { CustomEmit, DataFilter } from '../../../../../../../../shared/filter-input/interfaces/interfaces';
import { AccountToggleAddEditModalData } from '../../../../interfaces/AccountToggleAddEditModalData';
import { Station } from '../../../../../configuraciones/submodules/estaciones/interfaces/Station';
import { Enterprise } from 'src/app/pages/modules/modules/configuraciones/submodules/empresas/interfaces/Enterprise';
import { AccountAdd } from '../../../../interfaces/AccountAdd';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'toggle-add-edit-account-component',
  templateUrl: './toggle-add-edit-account.component.html'
})
export class ToggleAddEditAccountComponent {
  private _accountForm: FormGroup;
  private _msgErrors: string[];
  private _banks: string[];
  private _stations: Station[];
  private _enterprises: Enterprise[];
  private _ownersFilter!: DataFilter;

  get accountForm() {
    return this._accountForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  get banks() {
    return this._banks;
  }

  get ownersFilter() {
    return this._ownersFilter;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _stationService: StationService,
    private _enterpriseService: EnterpriseService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _dialogRef: MatDialogRef<ToggleAddEditAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountToggleAddEditModalData
  ) {
    this._accountForm = this._formBuilder.group({
      ownerId: [!this.data.entity ? '' : this.data.ownerId, [Validators.required]],
      bankName: [!this.data.entity ? '' : this.data.entity.bankName, [Validators.required]],
      accountNumber: [!this.data.entity ? '' : this.data.entity.accountNumber, [Validators.required, Validators.pattern(/^\d{14,19}$/)]],
    });

    this._msgErrors = [];

    this._banks = ['BANORTE', 'BBVA', 'SANTANDER', 'INBURSA', 'BAJIO', 'AZTECA', 'SCOTIABANK', 'BANREGIO'];

    this._stations = this._enterprises = [];
    this._stationService.getAll().subscribe((respStations: DefaultResponse<Station[]>) => {
      if (respStations.error) {
        return;
      }

      this._stations = respStations.payload;

      this._enterpriseService.getAll().subscribe((respEnterprises: DefaultResponse<Enterprise[]>) => {
        this._enterprises = respEnterprises.payload;
        this.initFilter();
      });
    });
  }

  initFilter() {
    let stationsNames = this._stations.map((element: Station) => { return element.nickName; });
    let stationsIds = this._stations.map((element: Station) => { return element.id; });

    let enterprisesNames = this._enterprises.map((element: Enterprise) => { return element.nickName; });
    let enterprisesIds = this._enterprises.map((element: Enterprise) => { return element.id; });

    let names = stationsNames.concat(enterprisesNames);
    let ids = stationsIds.concat(enterprisesIds);

    this._ownersFilter = {
      title: 'Propietarios',
      attribute: 'ownerNickName',
      items: names,
      required: true,
      values: ids,
      initialValue: null
    };
  }

  selectedItem(owner: CustomEmit) {
    this._accountForm.controls['ownerId'].setValue(owner.value);
  }

  close() {
    this._dialogRef.close();
  }

  action() {
    this._spinnerService.show('spinnerToggleAddEditAccount');

    let ownerId: string = this._accountForm.get('ownerId')!.value;
    let account: AccountAdd = {
      bankName: this._accountForm.get('bankName')!.value,
      accountNumber: this._accountForm.get('accountNumber')!.value,
    };

    if (!this.data.entity)
      this.save(ownerId, account)
    else
      this.update(ownerId, account);

  }

  validate() {
    for (const field in this._accountForm.controls)
      this.validateField(field);
  }

  validateField(attribute: string) {
    const errors = this._accountForm.get(attribute)!.errors;
    switch (attribute) {
      case 'bankName':
        errors ? this._msgErrors[0] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[0] = '';
        break;

      case 'accountNumber':
        errors ? this._msgErrors[1] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[1] = '';
        break;
    }
  }

  save(ownerId: string, account: AccountAdd) {
    this.data.service.addAccount(ownerId, account).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditAccount');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }

  update(ownerId: string, account: AccountAdd) {
    this.data.service.updateAccount(ownerId, this.data.entity.id, account).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditAccount');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }
}
