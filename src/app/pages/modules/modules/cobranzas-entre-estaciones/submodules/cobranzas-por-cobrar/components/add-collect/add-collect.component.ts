import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FilterInputComponent } from '../../../../../../../../shared/filter-input/filter-input.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { CollectService } from '../../../../../../../../services/collect.service';
import { StationService } from '../../../../../../../../services/station.service';

import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';
import { ValidateProvider } from '../../../../../../../../providers/validate.provider';

import { CustomEmit, DataFilter } from '../../../../../../../../shared/filter-input/interfaces/interfaces';
import { ServiceModalData } from '../../../../../../../../interfaces/ServiceModalData';
import { Station } from '../../../../../configuraciones/submodules/estaciones/interfaces/Station';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';
import { FormatProvider } from '../../../../../../../../providers/format.provider';
import { CollectAdd } from '../../../../interfaces/CollectAdd';

@Component({
  selector: 'add-collect-component',
  templateUrl: './add-collect.component.html'
})
export class AddCollectComponent {
  public maxDate: Date;

  private _collectForm: FormGroup;
  private _msgErrors: string[];
  private _stationsCollectNickNames!: DataFilter;
  private _stationsPayNickNames!: DataFilter;

  @ViewChild('townsFilterInput') townsFilterInput!: FilterInputComponent;
  @Output() enterprise!: EventEmitter<any>;

  get collectForm() {
    return this._collectForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  get stationsCollectsNickNames() {
    return this._stationsCollectNickNames;
  }

  get stationsPayNickNames() {
    return this._stationsPayNickNames;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _stationService: StationService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _formatProvider: FormatProvider,
    private _dialogRef: MatDialogRef<AddCollectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceModalData<CollectService>
  ) {
    this.maxDate = new Date();

    this._collectForm = this._formBuilder.group({
      stationCollectId: ['', [Validators.required]],
      stationPayId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      file: ['', [Validators.required]],
      debitDate: ['', [Validators.required]],
    });

    this._msgErrors = [];

    this._stationService.getStationsOfUser().subscribe((resp: DefaultResponse<Station[]>) => {
      this.initStationsCollectFilter(resp.error ? [] : resp.payload);
    });

    this._stationService.getAll().subscribe((resp: DefaultResponse<Station[]>) => {
      this.initStationsPayFilter(resp.error ? [] : resp.payload);
    });
  }

  initStationsCollectFilter(stations: Station[]) {
    let nickNames = stations.map((element: Station) => element.nickName);
    let ids = stations.map((element: Station) => element.id);

    this._stationsCollectNickNames = {
      title: 'Estación que cobra',
      attribute: 'stationCollectId',
      items: nickNames,
      required: true,
      values: ids,
      initialValue: null
    }
  }

  initStationsPayFilter(stations: Station[]) {
    let nickNames = stations.map((element: Station) => element.nickName);
    let ids = stations.map((element: Station) => element.id);

    this._stationsPayNickNames = {
      title: 'Estación que paga',
      attribute: 'stationPayId',
      items: nickNames,
      required: true,
      values: ids,
      initialValue: null
    }
  }

  selectedItem(emited: CustomEmit) {
    this._collectForm.controls[emited.attribute].setValue(emited.value);
  }

  validate() {
    this.townsFilterInput.validate();
    for (const field in this._collectForm.controls)
      this.validateField(field);
  }

  validateField(attribute: string) {
    const errors = this._collectForm.get(attribute)!.errors;
    switch (attribute) {
      case 'amount':
        errors ? this._msgErrors[0] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[0] = '';
        break;

      case 'file':
        errors ? this._msgErrors[1] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[1] = '';
        break;

      case 'debitDate':
        errors ? this._msgErrors[2] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[2] = '';
        break;
    }
  }

  close() {
    this._dialogRef.close();
  }

  async save() {
    this._spinnerService.show('spinnerToggleAddCollect');

    const collect: CollectAdd = {
      stationCollectId: this._collectForm.get('stationCollectId')!.value,
      stationPayId: this._collectForm.get('stationPayId')!.value,
      amount: this._collectForm.get('amount')!.value,
      file: await this._formatProvider.convertFileToBase64(this._collectForm.get('file')!.value),
      debitDate: this._formatProvider.dateObjToMDYString(<Date>this._collectForm.get('debitDate')!.value)
    };

    this.data.service.save(collect).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddCollect');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }
}
