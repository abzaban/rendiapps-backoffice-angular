import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { CollectTable } from '../pages/modules/modules/cobranzas-entre-estaciones/interfaces/CollectTable';

import { DefaultResponse } from '../interfaces/DefaultResponse';
import { CollectAdd } from '../pages/modules/modules/cobranzas-entre-estaciones/interfaces/CollectAdd';
import { PaymentSave } from '../pages/modules/modules/cobranzas-entre-estaciones/interfaces/PaymentSave';

@Injectable({
    providedIn: 'root',
})
export class CollectService extends BaseService {
    private _collectsUrl: string;

    constructor(private http: HttpClient) {
        super();
        this._collectsUrl = `${environment.base_url}/collects`;
    }

    getTableAdapterOfCollectsToCollectInDateRange(startDate: string, endDate: string) {
        const params = new HttpParams()
            .set('ra_token', this.token)
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http.get<DefaultResponse<CollectTable[]>>(`${this._collectsUrl}/getTableAdapterOfCollectsToCollectInDateRange`, { params });
    }

    save(collect: CollectAdd) {
        const body = {
            ra_token: this.token,
            stationCollectId: collect.stationCollectId,
            stationPayId: collect.stationPayId,
            amount: collect.amount,
            file: collect.file,
            debitDate: collect.debitDate
        };
        return this.http.post<DefaultResponse<null>>(this._collectsUrl, body);
    }

    delete(collectId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.delete<DefaultResponse<null>>(`${this._collectsUrl}/${collectId}`, { params });
    }

    getTableAdapterOfCollectsToPayInDateRange(startDate: string, endDate: string) {
        const params = new HttpParams()
            .set('ra_token', this.token)
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http.get<DefaultResponse<CollectTable[]>>(`${this._collectsUrl}/getTableAdapterOfCollectsToPayInDateRange`, { params });
    }

    savePayment(collectId: string, payment: PaymentSave) {
        const body = {
            ra_token: this.token,
            amount: payment.amount,
            file: payment.file,
            paymentDate: payment.paymentDate
        };
        return this.http.post<DefaultResponse<null>>(`${this._collectsUrl}/${collectId}/payments`, body);
    }

    deletePayment(collectId: string, paymentId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.delete<DefaultResponse<null>>(`${this._collectsUrl}/${collectId}/payments/${paymentId}`, { params });
    }

    getTableAdapterOfCollectsPendingProccessingInDateRange(startDate: string, endDate: string) {
        const params = new HttpParams()
            .set('ra_token', this.token)
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http.get<DefaultResponse<CollectTable[]>>(`${this._collectsUrl}/getTableAdapterOfCollectsPendingProccessingInDateRange`, { params });
    }

    authorize(collectId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<null>>(`${this._collectsUrl}/${collectId}/authorize`, { params });
    }

    reject(collectId: string, rejectedNote: string) {
        const body = {
            ra_token: this.token,
            rejectedNote
        };
        return this.http.post<DefaultResponse<null>>(`${this._collectsUrl}/${collectId}/reject`, body);
    }
}
