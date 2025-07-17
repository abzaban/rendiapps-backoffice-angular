import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';
import { ToggleAddEditDepartmentComponent } from './components/toggle-add-edit-department/toggle-add-edit-department.component';

import { DepartmentService } from '../../../../../../services/department.service';

import { SnackbarProvider } from '../../../../../../providers/snackbar.provider';
import { FilterProvider } from '../../../../../../providers/filter.provider';
import { SortProvider } from '../../../../../../providers/sort.provider';

import { CustomEmit, DataFilter } from '../../../../../../shared/filter-input/interfaces/interfaces';
import { CustomSortTableAction } from '../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../interfaces/CrudTableAction';
import { DepartmentTable } from './interfaces/DepartmentTable';
import { Department } from './interfaces/Department';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'departments-page',
  templateUrl: './departments.page.html'
})
export class DepartmentsPage implements OnInit {
  private _departments: DepartmentTable[];
  private _departments$: Subject<DepartmentTable[]>;
  private _ownersNickNames!: DataFilter;
  private _departmentsNames!: DataFilter;

  @ViewChild('ownersNickNamesFilterInput') ownersNickNamesFilterInput!: FilterInputComponent;
  @ViewChild('departmentsNamesFilterInput') departmentsNamesFilterInput!: FilterInputComponent;

  get departments$() {
    return this._departments$.asObservable();
  }

  get ownersNickNames() {
    return this._ownersNickNames;
  }

  get departmentsNames() {
    return this._departmentsNames;
  }

  constructor(
    private _departmentService: DepartmentService,
    private _snackbarProvider: SnackbarProvider,
    private _filterProvider: FilterProvider,
    private _sortProvider: SortProvider,
    private _dialog: MatDialog
  ) {
    this._departments = [];
    this._departments$ = new Subject();
  }

  ngOnInit() {
    this._departmentService.getTableAdapter().subscribe((resp: DefaultResponse<DepartmentTable[]>) => {
      this._departments = resp.error ? [] : resp.payload;
      this._departments$.next(this._departments);
      this.initFilters();
    });
  }

  initFilters() {
    let nickNames = this._departments
      .map((element: DepartmentTable) => element.ownerNickName)
      .filter(
        (element: any, index: number, self) =>
          index === self.findIndex(
            (e) => e === element
          )
      );
    this._ownersNickNames = {
      title: 'Propietarios',
      attribute: 'ownerNickName',
      items: nickNames,
      required: false,
      values: nickNames,
      initialValue: null
    }

    let names = this._departments
      .map((element: DepartmentTable) => element.name)
      .filter(
        (element: any, index: number, self) =>
          index === self.findIndex(
            (e) => e === element
          )
      );
    this._departmentsNames = {
      title: 'Departamentos',
      attribute: 'name',
      items: names,
      required: false,
      values: names,
      initialValue: null
    }
  }

  selectedItem(item: CustomEmit) {
    let filteredData: DepartmentTable[] = [...this._departments];

    if (this.ownersNickNamesFilterInput.dataCtrl.value)
      filteredData = this._filterProvider.filterByOneAttribute(
        this.ownersNickNamesFilterInput.dataCtrl.value,
        this.ownersNickNamesFilterInput.filter.attribute,
        filteredData
      );

    if (this.departmentsNamesFilterInput.dataCtrl.value)
      filteredData = this._filterProvider.filterByOneAttribute(
        this.departmentsNamesFilterInput.dataCtrl.value,
        this.departmentsNamesFilterInput.filter.attribute,
        filteredData
      );

    this._departments$.next(filteredData);
  }

  resetFilter() {
    this._departments$.next(this._departments);
    this.ownersNickNamesFilterInput.dataCtrl.setValue('');
    this.departmentsNamesFilterInput.dataCtrl.setValue('');
  }

  sortColumn(sortTableAction: CustomSortTableAction) {
    this._departments$.next(this._sortProvider.sort(sortTableAction, this._departments))
    this.ownersNickNamesFilterInput.dataCtrl.setValue('');
    this.departmentsNamesFilterInput.dataCtrl.setValue('');
  }

  emited(action: CrudTableAction) {
    switch (action.action) {
      case 'edit':
        this.edit(action.entityId);
        break;

      case 'delete':
        this.delete(action.entityId);
        break;
    }
  }

  openAddModal(editMode: boolean, station: any | null) {
    const dialogRef = this._dialog.open(ToggleAddEditDepartmentComponent, {
      disableClose: true,
      data: { service: this._departmentService, entity: editMode ? station : null }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._departmentService.getTableAdapter().subscribe((resp: DefaultResponse<DepartmentTable[]>) => {
        this._departments = resp.payload;
        this._departments$.next(resp.payload);
        this.ownersNickNamesFilterInput.dataCtrl.setValue('');
        this.departmentsNamesFilterInput.dataCtrl.setValue('');
        this.initFilters();
      });
    });
  }

  edit(stationId: string) {
    this._departmentService.get(stationId).subscribe((resp: DefaultResponse<Department>) => {
      const station: Department = resp.payload;
      this.openAddModal(true, station);
    });
  }

  delete(stationId: string) {
    this._snackbarProvider.openActionsSnackbar(
      'Dando de baja departmaneto',
      'red-snackbar',
      () => {
        this._departmentService.delete(stationId).subscribe((resp: DefaultResponse<null>) => {
          if (resp.error) {
            this._snackbarProvider.openNotifications(resp.msg, 'Error');
            return;
          }

          this._snackbarProvider.openNotifications(resp.msg, 'Success');
          this.ngOnInit();
          this.resetFilter();
        });
      }
    );
  }
}
