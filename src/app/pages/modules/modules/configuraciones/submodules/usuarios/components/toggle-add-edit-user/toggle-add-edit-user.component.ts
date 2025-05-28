import { Component, Inject, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { StationService } from '../../../../../../../../services/station.service';
import { EnterpriseService } from '../../../../../../../../services/enterprise.service';
import { ModuleService } from '../../../../../../../../services/module.service';

import { ValidateProvider } from '../../../../../../../../providers/validate.provider';
import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { CustomEmit, DataFilter } from '../../../../../../../../shared/filter-input/interfaces/interfaces';
import { ModuleRoleEmit } from '../../interfaces/ModuleRoleEmit';
import { Enterprise } from '../../../empresas/interfaces/Enterprise';
import { Station } from '../../../estaciones/interfaces/Station';
import { Module } from '../../../../../../interfaces/Module';
import { Rol } from '../../../../../../interfaces/Rol';
import { UserPermission } from '../../interfaces/UserPermission';
import { UserModulePermission } from '../../interfaces/UserModulePermission';
import { UserAdd } from '../../interfaces/UserAdd';
import { UserUpdate } from '../../interfaces/UserUpdate';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';
import { EntityServiceModalData } from '../../../../../../../../interfaces/EntityServiceModalData';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../interfaces/User';

@Component({
  selector: 'toggle-add-edit-user-component',
  templateUrl: './toggle-add-edit-user.component.html',
  styleUrls: ['./toggle-add-edit-user.component.scss']
})
export class ToggleAddEditUserComponent {
  public hidePassword: boolean;

  private _userForm: FormGroup;
  private _msgErrors: string[];

  private _enterprises: Enterprise[];
  private _enteprisesFilter!: DataFilter;
  private _selectedEnterprise!: CustomEmit;

  private _stations: Station[];
  private _stationsFilter!: DataFilter;
  private _selectedStation!: CustomEmit;

  private _modules: Module[];
  private _modulesFilter!: DataFilter;
  private _selectedModule!: ModuleRoleEmit;

  @Output() user!: EventEmitter<UserAdd>;

  get userForm() {
    return this._userForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  get enterprises() {
    return this._enterprises;
  }

  get enterprisesFilter() {
    return this._enteprisesFilter;
  }

  get stations() {
    return this._stations;
  }

  get stationsFilter() {
    return this._stationsFilter;
  }

  get modules() {
    return this._modules;
  }

  get modulesFilter() {
    return this._modulesFilter;
  }

  get module() {
    return this._selectedModule;
  }

  get rolesOfSelectedModule() {
    return this._modules.filter((element: Module) => element.id == this._selectedModule.value)[0].roles || [];
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _stationService: StationService,
    private _enterpriseService: EnterpriseService,
    private _moduleService: ModuleService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _dialogRef: MatDialogRef<ToggleAddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityServiceModalData<UserService, User>
  ) {
    this.hidePassword = true;

    let userPermission: UserPermission = {
      enterprises: [],
      stations: [],
      modules: []
    }

    this._userForm = this._formBuilder.group({
      firstName: [!this.data.entity ? '' : this.data.entity.firstName, [Validators.required]],
      lastName: [!this.data.entity ? '' : this.data.entity.lastName, [Validators.required]],
      address: [!this.data.entity ? '' : this.data.entity.address, [Validators.required]],
      email: [!this.data.entity ? '' : this.data.entity.email, [Validators.required, Validators.email]],
      username: [!this.data.entity ? '' : this.data.entity.username, [Validators.required, Validators.minLength(4)]],
      password: this.data.entity ? [''] : ['', [Validators.required, Validators.minLength(6)]],
      permissions: [!this.data.entity ? userPermission : this.data.entity.permissions, [Validators.required]]
    });

    this._msgErrors = [];

    this._stations = [];
    this._stationService.getAll().subscribe((resp: DefaultResponse<Station[]>) => {
      this._stations = resp.payload;
      this.initStationsFilter();

      if (this.data.entity)
        this.formatStations()
    });

    this._enterprises = [];
    this._enterpriseService.getAll().subscribe((resp: DefaultResponse<Enterprise[]>) => {
      this._enterprises = resp.payload;
      this.initEnterprisesFilter();

      if (this.data.entity)
        this.formatEnterprises()
    });

    this._modules = [];
    this._moduleService.getAll().subscribe((resp: DefaultResponse<Module[]>) => {
      this._modules = resp.payload;
      this.initModulesFilter();

      if (this.data.entity)
        this.formatModules()
    });
  }

  formatStations() {
    this.userForm.get('permissions')!.value.stations = this.data.entity.permissions.stations.map((id: string) => {
      let stationData = this._stations.find((element: Station) => element.id == id);
      let customEmit: CustomEmit = {
        attribute: 'nickName',
        item: stationData!.nickName,
        value: id
      };
      return customEmit
    });
  }

  initStationsFilter() {
    let nickNames = this._stations.map((element: Enterprise) => {
      return element.nickName;
    });
    let ids = this._stations.map((element: Enterprise) => {
      return element.id;
    });
    this._stationsFilter = {
      title: 'Estaciones',
      attribute: 'nickName',
      items: nickNames,
      required: false,
      values: ids,
      initialValue: null
    };
  }

  selectedStation(item: CustomEmit) {
    this._selectedStation = item;
  }

  addStation() {
    this.validate();
    if (this._selectedStation.item == '')
      return;

    const stations: CustomEmit[] = this._userForm.get('permissions')!.value.stations;
    if (stations.find(element => element.value == this._selectedStation.value))
      return;

    stations.push(this._selectedStation)
    this._userForm.get('permissions')!.value.stations = stations;
  }

  removeStation(index: number) {
    let stations: CustomEmit[] = this._userForm.get('permissions')!.value.stations;
    this._userForm.get('permissions')!.value.stations = stations.filter((element: CustomEmit, currentIndex: number) => index != currentIndex);
  }

  formatEnterprises() {
    this.userForm.get('permissions')!.value.enterprises = this.data.entity.permissions.enterprises.map((id: string) => {
      let enterpriseData = this._enterprises.find((element: Enterprise) => element.id == id);
      let customEmit: CustomEmit = {
        attribute: 'nickName',
        item: enterpriseData!.nickName,
        value: id
      };
      return customEmit
    });
  }

  initEnterprisesFilter() {
    let nickNames = this._enterprises.map((element: Enterprise) => {
      return element.nickName;
    });
    let ids = this._enterprises.map((element: Enterprise) => {
      return element.id;
    });
    this._enteprisesFilter = {
      title: 'Empresas',
      attribute: 'nickName',
      items: nickNames,
      required: false,
      values: ids,
      initialValue: null
    };
  }

  selectedEnterprise(item: CustomEmit) {
    this._selectedEnterprise = item;
  }

  addEnterprise() {
    this.validate();
    if (this._selectedEnterprise.item == '')
      return;

    const enterprises: CustomEmit[] = this._userForm.get('permissions')!.value.enterprises;
    if (enterprises.find(element => element.value == this._selectedEnterprise.value))
      return;

    enterprises.push(this._selectedEnterprise)
    this._userForm.get('permissions')!.value.enterprises = enterprises;
  }

  removeEnterprise(index: number) {
    let enterprises: CustomEmit[] = this._userForm.get('permissions')!.value.enterprises;
    this._userForm.get('permissions')!.value.enterprises = enterprises.filter((element: CustomEmit, currentIndex: number) => index != currentIndex);
  }

  formatModules() {
    this.userForm.get('permissions')!.value.modules = this.data.entity.permissions.modules.map((modulePermission: UserModulePermission) => {
      let moduleData = this._modules.find((element: Module) => element.id == modulePermission.moduleId);
      let roleData: Rol | undefined = undefined;
      if (moduleData!.roles.length > 0)
        roleData = moduleData!.roles.find((element: Rol) => element.id == modulePermission.roleId);

      let customEmit: ModuleRoleEmit = {
        attribute: 'nickName',
        item: moduleData!.name,
        value: modulePermission.moduleId,
        roleName: roleData ? roleData.name : 'Sin roles',
        roleId: roleData ? roleData.id : -1
      };
      return customEmit
    });
  }

  initModulesFilter() {
    let names = this._modules.map((element: Module) => {
      return element.name;
    });
    let ids = this._modules.map((element: Module) => {
      return element.id;
    });
    this._modulesFilter = {
      title: 'Módulos',
      attribute: 'name',
      items: names,
      required: false,
      values: ids,
      initialValue: null
    };
  }

  selectedModule(item: CustomEmit) {
    this._selectedModule = {
      item: item.item,
      value: item.value,
      attribute: item.attribute,
      roleName: '',
      roleId: -1
    };
  }

  addModule() {
    this.validate();
    if (this._selectedModule.item == '' || this._selectedModule.roleId < 0)
      return;

    const modules: CustomEmit[] = this._userForm.get('permissions')!.value.modules;
    if (modules.find(element => element.value == this._selectedModule.value))
      return;

    modules.push(this._selectedModule)
    this._userForm.get('permissions')!.value.modules = modules;
  }

  removeModule(index: number) {
    let modules: CustomEmit[] = this._userForm.get('permissions')!.value.modules;
    this._userForm.get('permissions')!.value.modules = modules.filter((element: CustomEmit, currentIndex: number) => index != currentIndex);
  }

  addRole(selected: Rol) {
    this._selectedModule.roleId = selected.id;
    this._selectedModule.roleName = selected.name;
  }

  close() {
    this._dialogRef.close();
  }

  action() {
    this._spinnerService.show('spinnerToggleAddEditUser');

    let userPermissions: UserPermission = {
      enterprises: this.userForm.get('permissions')!.value.enterprises.map((element: CustomEmit) => element.value),
      stations: this.userForm.get('permissions')!.value.stations.map((element: CustomEmit) => element.value),
      modules: this.userForm.get('permissions')!.value.modules.map((element: ModuleRoleEmit) => {
        return { moduleId: element.value, roleId: element.roleId };
      })
    }

    if (!this.data.entity)
      this.save({
        firstName: this._userForm.get('firstName')!.value,
        lastName: this._userForm.get('lastName')!.value,
        address: this._userForm.get('address')!.value,
        email: this._userForm.get('email')!.value,
        username: this._userForm.get('username')!.value,
        password: this._userForm.get('password')!.value,
        permissions: userPermissions
      });
    else
      this.update({
        firstName: this._userForm.get('firstName')!.value,
        lastName: this._userForm.get('lastName')!.value,
        address: this._userForm.get('address')!.value,
        permissions: userPermissions
      });
  }

  save(user: UserAdd) {
    this.data.service.add(user).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditUser');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }

  update(user: UserUpdate) {
    this.data.service.update(this.data.entity.id, user).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleAddEditUser');
      this._snackbarProvider.openNotifications(resp.msg, resp.error ? 'Error' : 'Success');
      if (resp.error)
        return;

      this.close()
    });
  }

  validate() {
    for (const field in this._userForm.controls)
      this.validateField(field);
  }

  validateField(attribute: string) {
    const errors = this._userForm.get(attribute)!.errors;
    switch (attribute) {
      case 'firstName':
        errors ? this._msgErrors[0] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[0] = '';
        break;

      case 'lastName':
        errors ? this._msgErrors[1] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[1] = '';
        break;

      case 'address':
        errors ? this._msgErrors[2] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[2] = '';
        break;

      case 'email':
        errors ? this._msgErrors[3] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[3] = '';
        break;

      case 'username':
        errors ? this._msgErrors[4] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[4] = '';
        break;

      case 'password':
        errors ? this._msgErrors[5] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[5] = '';
        break;
    }
  }
}
