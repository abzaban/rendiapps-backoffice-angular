import { Component, AfterViewInit, Input, ViewChild, AfterContentInit, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';

import { CustomSortTableAction } from '../../../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../../../interfaces/CrudTableAction';
import { DepartmentTable } from '../../interfaces/DepartmentTable';

@Component({
  selector: 'departments-table-component',
  templateUrl: './departments-table.component.html',
  styleUrls: ['./departments-table.component.scss']
})
export class DepartmentsTableComponent implements AfterViewInit, AfterContentInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<DepartmentTable>;

  @Input() departments!: Observable<DepartmentTable[]>;
  @Output() sortTableAction: EventEmitter<CustomSortTableAction>;
  @Output() departmentAction: EventEmitter<CrudTableAction>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get tableColumns() {
    return this._tableColumns;
  }

  get dataSource() {
    return this._dataSource;
  }

  constructor() {
    this._tableColumns = ['id', 'name', 'companyNickName', 'actions'];

    this._dataSource = new MatTableDataSource();

    this.departmentAction = new EventEmitter<CrudTableAction>();

    this.sortTableAction = new EventEmitter<CustomSortTableAction>();
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.departments.subscribe((departments: DepartmentTable[]) => {
      this._dataSource.data = departments;
    });
  }

  announceSortChange(sortTableAction: Sort) {
    this.sortTableAction.emit({
      active: sortTableAction.active,
      direction: sortTableAction.direction,
      isDate: false
    });
  }

  edit(departmentId: string) {
    this.departmentAction.emit({ action: 'edit', entityId: departmentId });
  }

  delete(departmentId: string) {
    this.departmentAction.emit({ action: 'delete', entityId: departmentId });
  }
}
