import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';
import { ToggleAddEditEnterpriseComponent } from './components/toggle-add-edit-enterprise/toggle-add-edit-enterprise.component';

import { EnterpriseService } from '../../../../../../services/enterprise.service';

import { SnackbarProvider } from '../../../../../../providers/snackbar.provider';
import { FilterProvider } from '../../../../../../providers/filter.provider';
import { SortProvider } from '../../../../../../providers/sort.provider';

import { CustomEmit, DataFilter } from '../../../../../../shared/filter-input/interfaces/interfaces';
import { CustomSortTableAction } from '../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../interfaces/CrudTableAction';
import { EnterpriseTable } from './interfaces/EnterpriseTable';
import { Enterprise } from './interfaces/Enterprise';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'enterprises-page',
  templateUrl: './enterprises.page.html'
})
export class EnterprisesPage implements OnInit {
  private _enterprises: EnterpriseTable[];
  private _enterprises$: Subject<EnterpriseTable[]>;
  private _enterprisesNickNames!: DataFilter;

  @ViewChild('nickNamesFilter') nicknamesFilterInput!: FilterInputComponent;

  get enterprises() {
    return this._enterprises;
  }

  get enterprises$() {
    return this._enterprises$.asObservable();
  }

  get enterprisesNickNames() {
    return this._enterprisesNickNames;
  }

  constructor(
    private _enterpriseService: EnterpriseService,
    private _snackbarProvider: SnackbarProvider,
    private _filterProvider: FilterProvider,
    private _sortProvider: SortProvider,
    private _dialog: MatDialog
  ) {
    this._enterprises = [];
    this._enterprises$ = new Subject();
  }

  ngOnInit() {
    this._enterpriseService.getTableAdapter().subscribe((resp: DefaultResponse<EnterpriseTable[]>) => {
      this._enterprises = resp.error ? [] : resp.payload;
      this._enterprises$.next(this._enterprises);
      this.initFilter();
    });
  }

  initFilter() {
    let nickNames = this._enterprises.map((element: EnterpriseTable) => {
      return element.nickName;
    });
    this._enterprisesNickNames = {
      title: 'Empresa',
      attribute: 'nickName',
      items: nickNames,
      required: false,
      values: nickNames,
      initialValue: null
    }
  }

  selectedItem(item: CustomEmit) {
    this._enterprises$.next(this._filterProvider.filterByOneAttribute(item.item, 'nickName', this._enterprises));
  }

  resetFilter() {
    this._enterprises$.next(this._enterprises);
    this.nicknamesFilterInput.dataCtrl.setValue('');
  }

  sortColumn(sortTableAction: CustomSortTableAction) {
    this._enterprises$.next(this._sortProvider.sort(sortTableAction, this._enterprises))
    this.nicknamesFilterInput.dataCtrl.setValue('');
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

  openAddModal(editMode: boolean, enterprise: Enterprise | null) {
    const dialogRef = this._dialog.open(ToggleAddEditEnterpriseComponent, {
      disableClose: true,
      data: { service: this._enterpriseService, entity: editMode ? enterprise : null }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._enterpriseService.getTableAdapter().subscribe((resp: DefaultResponse<EnterpriseTable[]>) => {
        this._enterprises = resp.payload;
        this._enterprises$.next(resp.payload);
        this.nicknamesFilterInput.dataCtrl.setValue('');
        this.initFilter();
      });
    });
  }

  edit(enterpriseId: string) {
    this._enterpriseService.get(enterpriseId).subscribe((resp: DefaultResponse<Enterprise>) => {
      const enterprise: Enterprise = resp.payload;
      this.openAddModal(true, enterprise);
    });
  }

  delete(enterpriseId: string) {
    this._snackbarProvider.openActionsSnackbar(
      'Eliminando empresa',
      'red-snackbar',
      () => {
        this._enterpriseService.delete(enterpriseId).subscribe((resp: DefaultResponse<null>) => {
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
