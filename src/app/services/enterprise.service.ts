import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { IdEnterpriseI } from '../interfaces/interfaces';

import { EnterpriseTable } from '../pages/modules/modules/configuraciones/submodules/empresas/interfaces/EnterpriseTable';
import { EnterpriseAdd } from '../pages/modules/modules/configuraciones/submodules/empresas/interfaces/EnterpriseAdd';
import { Enterprise } from '../pages/modules/modules/configuraciones/submodules/empresas/interfaces/Enterprise';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
    providedIn: 'root',
})
export class EnterpriseService extends BaseService {
    private _enterprisesUrl: string;

    constructor(private http: HttpClient) {
        super();
        this._enterprisesUrl = `${environment.base_url}/enterprises`;
    }

    add(enterprise: EnterpriseAdd) {
        const body = {
            ra_token: this.token,
            townId: enterprise.townId,
            businessName: enterprise.businessName,
            nickName: enterprise.nickName,
            rfc: enterprise.rfc,
            email: enterprise.email,
            cellphones: enterprise.cellphones,
            serverDomain: enterprise.serverDomain,
            category: enterprise.category,
            segment: enterprise.segment
        };
        return this.http.post<DefaultResponse<null>>(this._enterprisesUrl, body);
    }

    getAll() {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<Enterprise[]>>(`${this._enterprisesUrl}`, { params });
    }

    update(enterpriseId: string, enterprise: EnterpriseAdd) {
        const body = {
            ra_token: this.token,
            townId: enterprise.townId,
            businessName: enterprise.businessName,
            nickName: enterprise.nickName,
            rfc: enterprise.rfc,
            email: enterprise.email,
            cellphones: enterprise.cellphones,
            serverDomain: enterprise.serverDomain,
            category: enterprise.category,
            segment: enterprise.segment
        };
        return this.http.put<DefaultResponse<null>>(`${this._enterprisesUrl}/${enterpriseId}`, body);
    }

    delete(enterpriseId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.delete<DefaultResponse<null>>(`${this._enterprisesUrl}/${enterpriseId}`, { params });
    }

    getTableAdapter() {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<EnterpriseTable[]>>(`${this._enterprisesUrl}/getTableAdapter`, { params });
    }

    get(enterpriseId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<Enterprise>>(`${this._enterprisesUrl}/${enterpriseId}`, { params });
    }

    getEnterprisesIds() {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<IdEnterpriseI[]>>(this._enterprisesUrl, { params });
    }
}
