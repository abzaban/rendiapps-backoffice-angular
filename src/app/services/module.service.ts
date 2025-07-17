import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { BaseService } from './base.service';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
  providedIn: 'root',
})
export class ModuleService extends BaseService {
  private _modulesUrl: string;

  constructor(private http: HttpClient) {
    super();
    this._modulesUrl = `${environment.base_url}/modules`;
  }

  getAll() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<[]>>(this._modulesUrl, { params });
  }

  getModulesOfUser() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<[]>>(`${this._modulesUrl}/getModulesOfUser`, { params });
  }
}
