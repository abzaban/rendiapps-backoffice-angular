import { Component, AfterViewInit, Input, ViewChild, AfterContentInit, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';

import { ShowCellphonesComponent } from '../../../../components/show-cellphones/show-cellphones.component';

import { CustomSortTableAction } from '../../../../../../../../interfaces/CustomSortTableAction';
import { EnterpriseTable } from '../../interfaces/EnterpriseTable';
import { CrudTableAction } from '../../../../../../../../interfaces/CrudTableAction';

@Component({
  selector: 'enterprises-table-component',
  templateUrl: './enterprises-table.component.html',
  styleUrls: ['./enterprises-table.component.scss']
})
export class EnterprisesTableComponent implements AfterViewInit, AfterContentInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<EnterpriseTable>;

  @Input() enterprises!: Observable<EnterpriseTable[]>;
  @Output() sortTableAction: EventEmitter<CustomSortTableAction>;
  @Output() enterpriseAction: EventEmitter<CrudTableAction>;

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
      'actions'
    ];

    this._dataSource = new MatTableDataSource();

    this.sortTableAction = new EventEmitter<CustomSortTableAction>();

    this.enterpriseAction = new EventEmitter<CrudTableAction>();
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.enterprises.subscribe((enterprises: EnterpriseTable[]) => {
      this._dataSource.data = enterprises;
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

  edit(enterpriseId: string) {
    this.enterpriseAction.emit({ action: 'edit', entityId: enterpriseId });
  }

  delete(enterpriseId: string) {
    this.enterpriseAction.emit({ action: 'delete', entityId: enterpriseId });
  }
}
