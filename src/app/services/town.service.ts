import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { Town } from '../interfaces/Town';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
    providedIn: 'root',
})
export class TownService extends BaseService {
    private _townsUrl: string;

    constructor(private http: HttpClient) {
        super();
        this._townsUrl = `${environment.base_url}/towns`;
    }

    getTowns() {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<Town[]>>(this._townsUrl, { params });
    }
}
