import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FilterInputComponent } from '../../../../../../../../shared/filter-input/filter-input.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { TownService } from '../../../../../../../../services/town.service';
import { EnterpriseService } from '../../../../../../../../services/enterprise.service';

import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';
import { ValidateProvider } from '../../../../../../../../providers/validate.provider';

import { CustomEmit, DataFilter } from '../../../../../../../../shared/filter-input/interfaces/interfaces';
import { EntityServiceModalData } from '../../../../../../../../interfaces/EntityServiceModalData';
import { Town } from '../../../../../../../../interfaces/Town';
import { EnterpriseAdd } from '../../interfaces/EnterpriseAdd';
import { Enterprise } from '../../interfaces/Enterprise';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'toggle-add-edit-enterprise-component',
  templateUrl: './toggle-add-edit-enterprise.component.html',
  styleUrls: ['./toggle-add-edit-enterprise.component.scss']
})
export class ToggleAddEditEnterpriseComponent {
  private _enterpriseForm: FormGroup;
  private _msgErrors: string[];
  private _categories: string[];
  private _towns: Town[];
  private _townsFilter!: DataFilter;

  @ViewChild('townsFilterInput') townsFilterInput!: FilterInputComponent;
  @Output() enterprise!: EventEmitter<EnterpriseAdd>;

  get enterpriseForm() {
    return this._enterpriseForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  get categories() {
    return this._categories;
  }

  get towns() {
    return this._towns;
  }

  get townsFilter() {
    return this._townsFilter;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _townService: TownService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _dialogRef: MatDialogRef<ToggleAddEditEnterpriseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityServiceModalData<EnterpriseService, Enterprise>
  ) {
    this._enterpriseForm = this._formBuilder.group({
      townId: [!this.data.entity ? '' : this.data.entity.townId, [Validators.required]],
      businessName: [!this.data.entity ? '' : this.data.entity.businessName, [Validators.required]],
      nickName: [!this.data.entity ? '' : this.data.entity.nickName, [Validators.required]],
      rfc: [!this.data.entity ? '' : this.data.entity.rfc, [Validators.required]],
      serverDomain: [!this.data.entity ? '' : this.data.entity.serverDomain, [Validators.required]],
      email: [!this.data.entity ? '' : this.data.entity.email, [Validators.required, Validators.email]],
      category: [!this.data.entity ? '' : this.data.entity.category, [Validators.required]],
      segment: [!this.data.entity ? '' : this.data.entity.segment, [Validators.required]],
      cellphone: [],
      cellphones: [!this.data.entity ? [] : this.data.entity.cellphones]
    });

    this._msgErrors = [];

    this._categories = [
      'PROPIA',
      'RENTAMOS',
      'SOCIOS',
      'ADMINISTRAMOS'
    ];

    this._towns = [];
    this._townService.getTowns().subscribe((resp: DefaultResponse<Town[]>) => {
      this._towns = resp.payload;
      this.initFilter();
    });
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
    this._enterpriseForm.controls['townId'].setValue(town.value);
  }

  addCellphone() {
    this.validate();
    const cellphone: string = this._enterpriseForm.get('cellphone')!.value;
    if (cellphone.length != 10 || Number(cellphone) < 0) {
      this._snackbarProvider.openNotifications('Número no válido', 'Error');
      return;
    }

    const cellphones: string[] = this._enterpriseForm.get('cellphones')!.value;
    cellphones.push(cellphone);
    this._enterpriseForm.get('cellphones')!.setValue(cellphones);
  }

  removeCellphone(indexToRemove: number) {
    this.validate();
    let cellphones: string[] = this._enterpriseForm.get('cellphones')!.value;
    cellphones = cellphones.filter((element: string, index: number) => index != indexToRemove);
    this._enterpriseForm.get('cellphones')!.setValue(cellphones);
  }

  validate() {
    this.townsFilterInput.validate();
    for (const field in this._enterpriseForm.controls)
      this.validateField(field);
  }

  validateField(attribute: string) {
    const errors = this._enterpriseForm.get(attribute)!.errors;
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
    }
  }

  close() {
    this._dialogRef.close();
  }

  action() {
    this._spinnerService.show('spinnerToggleAddEditEnterprise');

    let enterprise: EnterpriseAdd = {
      townId: this._enterpriseForm.get('townId')!.value,
      businessName: this._enterpriseForm.get('businessName')!.value,
      nickName: this._enterpriseForm.get('nickName')!.value,
      rfc: this._enterpriseForm.get('rfc')!.value,
      serverDomain: this._enterpriseForm.get('serverDomain')!.value,
      email: this._enterpriseForm.get('email')!.value,
      category: this._enterpriseForm.get('category')!.value,
      segment: this._enterpriseForm.get('segment')!.value,
      cellphones: this._enterpriseForm.get('cellphones')!.value
    };

    if (!this.data.entity)
      this.save(enterprise)
    else
      this.update(enterprise);
  }

  save(enterprise: EnterpriseAdd) {
    this.data.service.add(enterprise).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditEnterprise');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }

  update(enterprise: EnterpriseAdd) {
    this.data.service.update(this.data.entity!.id, enterprise).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditEnterprise');
      this._snackbarProvider.openNotifications(resp.msg, resp.error ? 'Error' : 'Success');
      if (resp.error)
        return;

      this.close()
    });
  }
}
