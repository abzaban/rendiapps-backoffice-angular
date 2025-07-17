import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';
import { ToggleAddEditStationComponent } from './components/toggle-add-edit-station/toggle-add-edit-station.component';

import { StationService } from '../../../../../../services/station.service';

import { SnackbarProvider } from '../../../../../../providers/snackbar.provider';
import { FilterProvider } from '../../../../../../providers/filter.provider';
import { SortProvider } from '../../../../../../providers/sort.provider';

import { CustomEmit, DataFilter } from '../../../../../../shared/filter-input/interfaces/interfaces';
import { CustomSortTableAction } from '../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../interfaces/CrudTableAction';
import { StationTable } from './interfaces/StationTable';
import { Station } from './interfaces/Station';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'stations-page',
  templateUrl: './stations.page.html'
})
export class StationsPage implements OnInit {
  private _stations: StationTable[];
  private _stations$: Subject<StationTable[]>;
  private _enterprisesNickNames!: DataFilter;

  @ViewChild('nickNamesFilter') nicknamesFilterInput!: FilterInputComponent;

  get stations() {
    return this._stations;
  }

  get stations$() {
    return this._stations$.asObservable();
  }

  get enterprisesNickNames() {
    return this._enterprisesNickNames;
  }

  constructor(
    private _stationService: StationService,
    private _snackbarProvider: SnackbarProvider,
    private _filterProvider: FilterProvider,
    private _sortProvider: SortProvider,
    private _dialog: MatDialog
  ) {
    this._stations = [];
    this._stations$ = new Subject();
  }

  ngOnInit() {
    this._stationService.getTableAdapter().subscribe((resp: DefaultResponse<StationTable[]>) => {
      this._stations = resp.error ? [] : resp.payload;
      this._stations$.next(this._stations);
      this.initFilter();
    });
  }

  initFilter() {
    let nickNames = this._stations.map((element: StationTable) => {
      return element.nickName;
    });
    this._enterprisesNickNames = {
      title: 'Estación',
      attribute: 'nickName',
      items: nickNames,
      required: false,
      values: nickNames,
      initialValue: null
    }
  }

  selectedItem(item: CustomEmit) {
    this._stations$.next(this._filterProvider.filterByOneAttribute(item.item, 'nickName', this._stations));
  }

  resetFilter() {
    this._stations$.next(this._stations);
    this.nicknamesFilterInput.dataCtrl.setValue('');
  }

  sortColumn(sortTableAction: CustomSortTableAction) {
    this._stations$.next(this._sortProvider.sort(sortTableAction, this._stations))
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

  openAddModal(editMode: boolean, station: any | null) {
    const dialogRef = this._dialog.open(ToggleAddEditStationComponent, {
      disableClose: true,
      data: { service: this._stationService, entity: editMode ? station : null }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._stationService.getTableAdapter().subscribe((resp: DefaultResponse<StationTable[]>) => {
        this._stations = resp.payload;
        this._stations$.next(resp.payload);
        this.nicknamesFilterInput.dataCtrl.setValue('');
        this.initFilter();
      });
    });
  }

  edit(stationId: string) {
    this._stationService.get(stationId).subscribe((resp: DefaultResponse<Station>) => {
      const station: Station = resp.payload;
      this.openAddModal(true, station);
    });
  }

  delete(stationId: string) {
    this._snackbarProvider.openActionsSnackbar(
      'Eliminando estación',
      'red-snackbar',
      () => {
        this._stationService.delete(stationId).subscribe((resp: DefaultResponse<null>) => {
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
