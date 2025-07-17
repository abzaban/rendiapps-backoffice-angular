import { Component, AfterViewInit, Input, ViewChild, AfterContentInit, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Observable } from 'rxjs';

import { CustomSortTableAction } from '../../../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../../../interfaces/CrudTableAction';
import { User } from '../../interfaces/User';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'users-table-component',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements AfterViewInit, AfterContentInit {
  private _tableColumns: string[];
  private _dataSource: MatTableDataSource<User>;

  @Input() users!: Observable<User[]>;
  @Output() sortTableAction: EventEmitter<CustomSortTableAction>;
  @Output() userAction: EventEmitter<CrudTableAction>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get tableColumns() {
    return this._tableColumns;
  }

  get dataSource() {
    return this._dataSource;
  }

  constructor() {
    this._tableColumns = [
      'id',
      'firstName',
      'lastName',
      'address',
      'email',
      'username',
      'actions'
    ];

    this._dataSource = new MatTableDataSource();

    this.userAction = new EventEmitter<CrudTableAction>();
    
    this.sortTableAction = new EventEmitter<CustomSortTableAction>();
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.users.subscribe((users: User[]) => {
      this._dataSource.data = users;
    });
  }

  announceSortChange(sortTableAction: Sort) {
    this.sortTableAction.emit({
      active: sortTableAction.active,
      direction: sortTableAction.direction,
      isDate: false
    });
  }

  edit(userId: string) {
    this.userAction.emit({ action: 'edit', entityId: userId });
  }

  delete(userId: string) {
    this.userAction.emit({ action: 'delete', entityId: userId });
  }

  editPassword(userId: string) {
    this.userAction.emit({ action: 'update-password', entityId: userId });
  }
}
