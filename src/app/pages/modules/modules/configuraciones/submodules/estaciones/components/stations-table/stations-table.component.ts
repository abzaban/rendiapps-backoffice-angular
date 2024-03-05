import { Component, AfterViewInit, Input, ViewChild, AfterContentInit, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';

import { ShowCellphonesComponent } from '../../../../components/show-cellphones/show-cellphones.component';

import { CustomSortTableAction } from '../../../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../../../interfaces/CrudTableAction';
import { StationTable } from '../../interfaces/StationTable';

@Component({
  selector: 'stations-table-component',
  templateUrl: './stations-table.component.html',
  styleUrls: ['./stations-table.component.scss']
})
export class StationsTableComponent implements AfterViewInit, AfterContentInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<StationTable>;

  @Input() stations!: Observable<StationTable[]>;
  @Output() sortTableAction: EventEmitter<CustomSortTableAction>;
  @Output() stationAction: EventEmitter<CrudTableAction>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get tableColumns() {
    return this._tableColumns;
  }

  get dataSource() {
    return this._dataSource;
  }

  constructor(private _dialog: MatDialog) {
    this._tableColumns = [
      'id',
      'townName',
      'businessName',
      'nickName',
      'rfc',
      'email',
      'cellphones',
      'serverDomain',
      'category',
      'segment',
      'stationNumber',
      'brand',
      'legalPermission',
      'actions'
    ];

    this._dataSource = new MatTableDataSource();

    this.stationAction = new EventEmitter<CrudTableAction>();

    this.sortTableAction = new EventEmitter<CustomSortTableAction>();
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.stations.subscribe((stations: StationTable[]) => {
      this._dataSource.data = stations;
    });
  }

  announceSortChange(sortTableAction: Sort) {
    this.sortTableAction.emit({
      active: sortTableAction.active,
      direction: sortTableAction.direction,
      isDate: false
    });
  }

  showCellphones(nickName: string, cellphones: string[]) {
    const dialogRef = this._dialog.open(ShowCellphonesComponent, {
      width: '300px',
      data: { nickName, cellphones }
    });
  }

  edit(stationId: string) {
    this.stationAction.emit({ action: 'edit', entityId: stationId });
  }

  delete(stationId: string) {
    this.stationAction.emit({ action: 'delete', entityId: stationId });
  }
}
