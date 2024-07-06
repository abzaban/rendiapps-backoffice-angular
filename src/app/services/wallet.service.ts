import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { Wallet } from '../pages/modules/modules/finanzas/interfaces/Wallet';
import { WalletTable } from '../pages/modules/modules/finanzas/interfaces/WalletTable';
import { AccountAdd } from '../pages/modules/modules/finanzas/interfaces/AccountAdd';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
    providedIn: 'root',
})
export class WalletService extends BaseService {
    private _walletsUrl: string;

    constructor(private http: HttpClient) {
        super();
        this._walletsUrl = `${environment.base_url}/wallets`;
    }

    get(ownerId: string) {
        const params = new HttpParams().set('ra_token', this.token)
        return this.http.get<DefaultResponse<Wallet>>(`${this._walletsUrl}/${ownerId}`, { params });
    }

    getTableAdapter() {
        const params = new HttpParams().set('ra_token', this.token)
        return this.http.get<DefaultResponse<WalletTable[]>>(`${this._walletsUrl}/getTableAdapter`, { params });
    }

    addAccount(ownerId: string, account: AccountAdd) {
        const body = {
            ra_token: this.token,
            ownerId,
            bankName: account.bankName,
            accountNumber: account.accountNumber,
        };
        return this.http.post<DefaultResponse<null>>(this._walletsUrl, body);
    }

    updateAccount(ownerId: string, accountId: string, account: AccountAdd) {
        const body = {
            ra_token: this.token,
            bankName: account.bankName,
            accountNumber: account.accountNumber,
        };
        return this.http.put<DefaultResponse<null>>(`${this._walletsUrl}/${ownerId}/accounts/${accountId}`, body);
    }

    deleteAccount(ownerId: string, accountId: string) {
        const params = new HttpParams().set('ra_token', this.token)
        return this.http.delete<DefaultResponse<null>>(`${this._walletsUrl}/${ownerId}/accounts/${accountId}`, { params });
    }
}
