import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FilterInputComponent } from '../../../../../../../../shared/filter-input/filter-input.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { StationService } from '../../../../../../../../services/station.service';
import { EnterpriseService } from '../../../../../../../../services/enterprise.service';
import { DepartmentService } from '../../../../../../../../services/department.service';

import { ValidateProvider } from '../../../../../../../../providers/validate.provider';
import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { CustomEmit, DataFilter } from '../../../../../../../../shared/filter-input/interfaces/interfaces';
import { EntityServiceModalData } from '../../../../../../../../interfaces/EntityServiceModalData';
import { Station } from 'src/app/pages/modules/modules/configuraciones/submodules/estaciones/interfaces/Station';
import { Enterprise } from '../../../../../configuraciones/submodules/empresas/interfaces/Enterprise';
import { DepartmentAdd } from '../../interfaces/DepartmentAdd';
import { Department } from '../../interfaces/Department';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'toggle-add-edit-department-component',
  templateUrl: './toggle-add-edit-department.component.html',
  styleUrls: ['./toggle-add-edit-department.component.scss']
})
export class ToggleAddEditDepartmentComponent {
  private _departmentForm: FormGroup;
  private _nameMsgError: string;
  private _stations: Station[];
  private _enterprises: Enterprise[];
  private _ownersFilter!: DataFilter;

  @ViewChild('townsFilterInput') townsFilterInput!: FilterInputComponent;

  get departmentForm() {
    return this._departmentForm;
  }

  get nameMsgError() {
    return this._nameMsgError;
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
    private _dialogRef: MatDialogRef<ToggleAddEditDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityServiceModalData<DepartmentService, Department>
  ) {
    this._departmentForm = this._formBuilder.group({
      name: [!this.data.entity ? '' : this.data.entity.name, [Validators.required]],
      ownerId: [!this.data.entity ? '' : this.data.entity.ownerId, [Validators.required]],
    });

    this._nameMsgError = '';

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
      initialValue: this.data.entity ? this.data.entity.ownerId : null
    };
  }

  selectedItem(emited: CustomEmit) {
    this._departmentForm.controls['ownerId'].setValue(emited.value);
  }

  validate() {
    this.townsFilterInput.validate();
    this.validateNameMsgError();
  }

  validateNameMsgError() {
    const errors = this._departmentForm.get('name')!.errors;
    errors ? this._nameMsgError = this._validateProvider.getErrorMsg(errors) : this._nameMsgError = '';
  }

  close() {
    this._dialogRef.close();
  }

  action() {
    this._spinnerService.show('spinnerToggleAddEditDepartment');

    let department: DepartmentAdd = {
      name: this._departmentForm.get('name')!.value,
      ownerId: this._departmentForm.get('ownerId')!.value,
    };

    if (!this.data.entity)
      this.save(department)
    else
      this.update(department);
  }

  save(department: DepartmentAdd) {
    this.data.service.add(department).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditDepartment');
      console.log(department);
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }

  update(department: DepartmentAdd) {
    this.data.service.update(this.data.entity!.id, department).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditDepartment');
      this._snackbarProvider.openNotifications(resp.msg, resp.error ? 'Error' : 'Success');
      if (resp.error)
        return;

      this.close()
    });
  }
}
