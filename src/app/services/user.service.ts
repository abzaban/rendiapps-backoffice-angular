import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { IdEstacionI } from '../interfaces/interfaces';

import { User } from '../pages/modules/modules/configuraciones/submodules/usuarios/interfaces/User';
import { UserAdd } from '../pages/modules/modules/configuraciones/submodules/usuarios/interfaces/UserAdd';
import { UserUpdate } from '../pages/modules/modules/configuraciones/submodules/usuarios/interfaces/UserUpdate';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private _usersUrl: string;

  constructor(private http: HttpClient) {
    super();
    this._usersUrl = `${environment.base_url}/users`;
  }

  add(user: UserAdd) {
    const body = {
      ra_token: this.token,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
      username: user.username,
      password: user.password,
      permissions: user.permissions
    };
    return this.http.post<DefaultResponse<null>>(this._usersUrl, body);
  }

  getAll() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<User[]>>(this._usersUrl, { params });
  }

  update(userId: string, user: UserUpdate) {
    const body = {
      ra_token: this.token,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      permissions: user.permissions
    };
    return this.http.put<DefaultResponse<null>>(`${this._usersUrl}/${userId}`, body);
  }

  delete(userId: string) {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.delete<DefaultResponse<null>>(`${this._usersUrl}/${userId}`, { params });
  }

  updatePassword(userId: string, password: string) {
    const body = {
      ra_token: this.token,
      password,
    };
    return this.http.put<DefaultResponse<null>>(`${this._usersUrl}/${userId}/updatePassword`, body);
  }

  // pendiente eliminar
  getEstaciones() {
    const url = `${this._usersUrl}/permisos/estaciones`;
    const params = new HttpParams().set('token', this.token);
    return this.http.get<DefaultResponse<IdEstacionI[]>>(url, { params });
  }
}
