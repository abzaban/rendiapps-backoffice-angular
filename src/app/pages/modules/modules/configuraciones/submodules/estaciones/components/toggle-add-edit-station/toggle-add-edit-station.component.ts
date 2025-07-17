import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FilterInputComponent } from '../../../../../../../../shared/filter-input/filter-input.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { TownService } from '../../../../../../../../services/town.service';
import { StationService } from '../../../../../../../../services/station.service';

import { ValidateProvider } from '../../../../../../../../providers/validate.provider';
import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { CustomEmit, DataFilter } from '../../../../../../../../shared/filter-input/interfaces/interfaces';
import { EntityServiceModalData } from '../../../../../../../../interfaces/EntityServiceModalData';
import { Town } from '../../../../../../../../interfaces/Town';
import { StationAdd } from '../../interfaces/StationAdd';
import { Station } from '../../interfaces/Station';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'toggle-add-edit-station-component',
  templateUrl: './toggle-add-edit-station.component.html',
  styleUrls: ['./toggle-add-edit-station.component.scss']
})
export class ToggleAddEditStationComponent {
  private _stationForm: FormGroup;
  private _msgErrors: string[];
  private _towns: Town[];
  private _townsFilter!: DataFilter;
  private _categories: string[];
  private _brands: string[];

  @ViewChild('townsFilterInput') townsFilterInput!: FilterInputComponent;
  @Output() station!: EventEmitter<StationAdd>;

  get stationForm() {
    return this._stationForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  get towns() {
    return this._towns;
  }

  get townsFilter() {
    return this._townsFilter;
  }

  get categories() {
    return this._categories;
  }

  get brands() {
    return this._brands;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _townService: TownService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _dialogRef: MatDialogRef<ToggleAddEditStationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityServiceModalData<StationService, Station>
  ) {
    this._stationForm = this._formBuilder.group({
      townId: [!this.data.entity ? '' : this.data.entity.townId, [Validators.required]],
      businessName: [!this.data.entity ? '' : this.data.entity.businessName, [Validators.required]],
      nickName: [!this.data.entity ? '' : this.data.entity.nickName, [Validators.required]],
      rfc: [!this.data.entity ? '' : this.data.entity.rfc, [Validators.required]],
      serverDomain: [!this.data.entity ? '' : this.data.entity.serverDomain, [Validators.required]],
      email: [!this.data.entity ? '' : this.data.entity.email, [Validators.required, Validators.email]],
      category: [!this.data.entity ? '' : this.data.entity.category, [Validators.required]],
      segment: [!this.data.entity ? '' : this.data.entity.segment, [Validators.required]],
      cellphone: [],
      cellphones: [!this.data.entity ? [] : this.data.entity.cellphones],
      stationNumber: [!this.data.entity ? '' : this.data.entity.stationNumber, [Validators.required]],
      brand: [!this.data.entity ? '' : this.data.entity.brand, [Validators.required]],
      legalPermission: [!this.data.entity ? '' : this.data.entity.legalPermission, [Validators.required]],
    });

    this._msgErrors = [];

    this._towns = [];
    this._townService.getTowns().subscribe((resp: DefaultResponse<Town[]>) => {
      this._towns = resp.payload;
      this.initFilter();
    });

    this._categories = [
      'PROPIA',
      'RENTAMOS',
      'SOCIOS',
      'ADMINISTRAMOS'
    ];

    this._brands = [
      'SIN MARCA',
      'QUICKGAS',
      'SMARTGAS'
    ];

  }

  initFilter() {
    let names = this._towns.map((element: Town) => {
      return element.name;
    });
    let ids = this._towns.map((element: Town) => {
      return element.id;
    });
    this._townsFilter = {
      title: 'Municipios',
      attribute: 'name',
      items: names,
      required: true,
      values: ids,
      initialValue: this.data.entity ? this.data.entity.townId : null
    };
  }

  selectedItem(town: CustomEmit) {
    this._stationForm.controls['townId'].setValue(town.value);
  }

  addCellphone() {
    this.validate();
    const cellphone: string = this._stationForm.get('cellphone')!.value;
    if (cellphone.length != 10 || Number(cellphone) < 0) {
      this._snackbarProvider.openNotifications('Número no válido', 'Error');
      return;
    }

    const cellphones: string[] = this._stationForm.get('cellphones')!.value;
    cellphones.push(cellphone);
    this._stationForm.get('cellphones')!.setValue(cellphones);
  }

  removeCellphone(indexToRemove: number) {
    this.validate();
    let cellphones: string[] = this._stationForm.get('cellphones')!.value;
    cellphones = cellphones.filter((element: string, index: number) => index != indexToRemove);
    this._stationForm.get('cellphones')!.setValue(cellphones);
  }

  close() {
    this._dialogRef.close();
  }

  action() {
    this._spinnerService.show('spinnerToggleAddEditStation');

    let station: StationAdd = {
      townId: this._stationForm.get('townId')!.value,
      businessName: this._stationForm.get('businessName')!.value,
      nickName: this._stationForm.get('nickName')!.value,
      rfc: this._stationForm.get('rfc')!.value,
      serverDomain: this._stationForm.get('serverDomain')!.value,
      email: this._stationForm.get('email')!.value,
      category: this._stationForm.get('category')!.value,
      segment: this._stationForm.get('segment')!.value,
      cellphones: this._stationForm.get('cellphones')!.value,
      stationNumber: this._stationForm.get('stationNumber')!.value,
      brand: this._stationForm.get('brand')!.value,
      legalPermission: this._stationForm.get('legalPermission')!.value,

    };

    if (!this.data.entity)
      this.save(station)
    else
      this.update(station);
  }

  save(station: StationAdd) {
    this.data.service.add(station).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditStation');
      this._snackbarProvider.openNotifications(resp.msg, resp.error ? 'Error' : 'Success');
      if (resp.error)
        return;

      this.close();
    });
  }

  update(station: StationAdd) {
    this.data.service.update(this.data.entity!.id, station).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditStation');
      this._snackbarProvider.openNotifications(resp.msg, resp.error ? 'Error' : 'Success');
      if (resp.error)
        return;

      this.close()
    });
  }

  validate() {
    this.townsFilterInput.validate();
    for (const field in this._stationForm.controls)
      this.validateField(field);
  }

  validateField(attribute: string) {
    const errors = this._stationForm.get(attribute)!.errors;
    switch (attribute) {
      case 'businessName':
        errors ? this._msgErrors[0] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[0] = '';
        break;

      case 'nickName':
        errors ? this._msgErrors[1] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[1] = '';
        break;

      case 'rfc':
        errors ? this._msgErrors[2] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[2] = '';
        break;

      case 'serverDomain':
        errors ? this._msgErrors[3] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[3] = '';
        break;

      case 'email':
        errors ? this._msgErrors[4] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[4] = '';
        break;

      case 'category':
        errors ? this._msgErrors[5] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[5] = '';
        break;

      case 'segment':
        errors ? this._msgErrors[6] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[6] = '';
        break;

      case 'stationNumber':
        errors ? this._msgErrors[7] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[7] = '';
        break;

      case 'brand':
        errors ? this._msgErrors[8] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[8] = '';
        break;

      case 'legalPermission':
        errors ? this._msgErrors[9] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[9] = '';
        break;
    }
  }
}
