import { Component, AfterViewInit, Input, ViewChild, AfterContentInit, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';

import { CustomSortTableAction } from '../../../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../../../interfaces/CrudTableAction';
import { CollectTable } from '../../../../interfaces/CollectTable';

@Component({
  selector: 'authorization-collects-table-component',
  templateUrl: './authorization-collects-table.component.html'
})
export class AuthorizationCollectsTableComponent implements AfterViewInit, AfterContentInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<CollectTable>;

  @Input() collects!: Observable<CollectTable[]>;
  @Output() sortTableAction: EventEmitter<CustomSortTableAction>;
  @Output() collectAction: EventEmitter<CrudTableAction>;

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
      'stationCollectNickName',
      'stationPayNickName',
      'status',
      'amount',
      'amountRemaining',
      'debitDate',
      'created_at',
      'actions'
    ];

    this._dataSource = new MatTableDataSource();

    this.sortTableAction = new EventEmitter<CustomSortTableAction>();

    this.collectAction = new EventEmitter<CrudTableAction>();
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.collects.subscribe((collects: CollectTable[]) => {
      this._dataSource.data = collects;
    });
  }

  announceSortChange(sortTableAction: Sort) {
    this.sortTableAction.emit({
      active: sortTableAction.active,
      direction: sortTableAction.direction,
      isDate: sortTableAction.active == 'debitDate' || sortTableAction.active == 'created_at'
    });
  }

  authorize(collectId: string) {
    this.collectAction.emit({ action: 'authorize', entityId: collectId });
  }

  reject(collectId: string) {
    this.collectAction.emit({ action: 'reject', entityId: collectId });
  }
}
