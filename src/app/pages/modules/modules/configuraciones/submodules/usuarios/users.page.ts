import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { FilterInputComponent } from '../../../../../../shared/filter-input/filter-input.component';
import { ToggleAddEditUserComponent } from './components/toggle-add-edit-user/toggle-add-edit-user.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';

import { UserService } from '../../../../../../services/user.service';

import { SnackbarProvider } from '../../../../../../providers/snackbar.provider';
import { FilterProvider } from '../../../../../../providers/filter.provider';
import { SortProvider } from '../../../../../../providers/sort.provider';

import { CustomEmit, DataFilter } from '../../../../../../shared/filter-input/interfaces/interfaces';
import { CustomSortTableAction } from '../../../../../../interfaces/CustomSortTableAction';
import { CrudTableAction } from '../../../../../../interfaces/CrudTableAction';
import { User } from './interfaces/User';

import { DefaultResponse } from '../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'users-page',
  templateUrl: './users.page.html'
})
export class UsersPage implements OnInit {
  private _users: User[];
  private _users$: Subject<User[]>;
  private _enterprisesNickNames!: DataFilter;

  @ViewChild('usernamesFilterInput') usernamesFilterInput!: FilterInputComponent;

  get users() {
    return this._users;
  }

  get users$() {
    return this._users$.asObservable();
  }

  get enterprisesNickNames() {
    return this._enterprisesNickNames;
  }

  constructor(
    private _userService: UserService,
    private _snackbarProvider: SnackbarProvider,
    private _filterProvider: FilterProvider,
    private _sortProvider: SortProvider,
    private _dialog: MatDialog
  ) {
    this._users = [];
    this._users$ = new Subject();
  }

  ngOnInit() {
    this._userService.getAll().subscribe((resp: DefaultResponse<User[]>) => {
      this._users = resp.error ? [] : resp.payload;
      this._users$.next(this._users);
      this.initFilter();
    });
  }

  initFilter() {
    let usernames = this._users.map((element: User) => {
      return element.username;
    });
    this._enterprisesNickNames = {
      title: 'Nombre de usuario',
      attribute: 'username',
      items: usernames,
      required: false,
      values: usernames,
      initialValue: null
    }
  }

  selectedItem(item: CustomEmit) {
    this._users$.next(this._filterProvider.filterByOneAttribute(item.item, 'username', this._users));
  }

  resetFilter() {
    this._users$.next(this._users);
    this.usernamesFilterInput.dataCtrl.setValue('');
  }

  sortColumn(sortTableAction: CustomSortTableAction) {
    this._users$.next(this._sortProvider.sort(sortTableAction, this._users))
    this.usernamesFilterInput.dataCtrl.setValue('');
  }

  emited(action: CrudTableAction) {
    switch (action.action) {
      case 'edit':
        this.edit(action.entityId);
        break;

      case 'delete':
        this.delete(action.entityId);
        break;

      case 'update-password':
        this.openUpdatePasswordModal(action.entityId);
        break;
    }
  }

  openAddModal(editMode: boolean, user: User | null) {
    const dialogRef = this._dialog.open(ToggleAddEditUserComponent, {
      disableClose: true,
      data: { service: this._userService, entity: editMode ? user : null }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._userService.getAll().subscribe((resp: DefaultResponse<User[]>) => {
        this._users = resp.payload;
        this._users$.next(resp.payload);
        this.usernamesFilterInput.dataCtrl.setValue('');
        this.initFilter();
      });
    });
  }

  edit(userId: string) {
    let user = this._users.filter(element => element.id == userId)[0];
    this.openAddModal(true, user);
  }

  delete(userId: string) {
    this._snackbarProvider.openActionsSnackbar(
      'Eliminando usuario',
      'red-snackbar',
      () => {
        this._userService.delete(userId).subscribe((resp: DefaultResponse<null>) => {
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

  openUpdatePasswordModal(userId: string) {
    const dialogRef = this._dialog.open(EditPasswordComponent, {
      disableClose: true,
      data: { service: this._userService, entityId: userId }
    });
    dialogRef.afterClosed().subscribe(() => {
      this._userService.getAll().subscribe((resp: DefaultResponse<User[]>) => {
        this._users = resp.payload;
        this._users$.next(resp.payload);
        this.usernamesFilterInput.dataCtrl.setValue('');
        this.initFilter();
      });
    });
  }
}
