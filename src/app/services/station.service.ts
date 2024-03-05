import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { IdEnterpriseI } from '../interfaces/interfaces';

import { StationTable } from '../pages/modules/modules/configuraciones/submodules/estaciones/interfaces/StationTable';
import { StationAdd } from '../pages/modules/modules/configuraciones/submodules/estaciones/interfaces/StationAdd';
import { Station } from '../pages/modules/modules/configuraciones/submodules/estaciones/interfaces/Station';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
  providedIn: 'root',
})
export class StationService extends BaseService {
  private _stationsUrl: string;

  constructor(private http: HttpClient) {
    super();
    this._stationsUrl = `${environment.base_url}/stations`;
  }

  add(station: StationAdd) {
    const body = {
      ra_token: this.token,
      townId: station.townId,
      businessName: station.businessName,
      nickName: station.nickName,
      rfc: station.rfc,
      email: station.email,
      cellphones: station.cellphones,
      serverDomain: station.serverDomain,
      category: station.category,
      segment: station.segment,
      stationNumber: station.stationNumber,
      brand: station.brand,
      legalPermission: station.legalPermission
    };
    return this.http.post<DefaultResponse<null>>(this._stationsUrl, body);
  }

  getAll() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<Station[]>>(`${this._stationsUrl}`, { params });
  }

  update(stationId: string, station: StationAdd) {
    const body = {
      ra_token: this.token,
      townId: station.townId,
      businessName: station.businessName,
      nickName: station.nickName,
      rfc: station.rfc,
      email: station.email,
      cellphones: station.cellphones,
      serverDomain: station.serverDomain,
      category: station.category,
      segment: station.segment,
      stationNumber: station.stationNumber,
      brand: station.brand,
      legalPermission: station.legalPermission
    };
    return this.http.put<DefaultResponse<null>>(`${this._stationsUrl}/${stationId}`, body);
  }

  delete(stationId: string) {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.delete<DefaultResponse<null>>(`${this._stationsUrl}/${stationId}`, { params });
  }

  getTableAdapter() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<StationTable[]>>(`${this._stationsUrl}/getTableAdapter`, { params });
  }

  getStationsOfUser() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<Station[]>>(`${this._stationsUrl}/getStationsOfUser`, { params });
  }

  get(stationId: string) {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<Station>>(`${this._stationsUrl}/${stationId}`, { params });
  }

  getStationsIds() {
    const params = new HttpParams().set('ra_token', this.token);
    return this.http.get<DefaultResponse<IdEnterpriseI[]>>(this._stationsUrl, { params });
  }
}
