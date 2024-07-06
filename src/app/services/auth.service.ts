import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { AuthResponse } from '../interfaces/AuthResponse';
import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private _authUrl: string;
  private _recoverPassowrdUrl: string;

  constructor(private http: HttpClient) {
    super();
    this._authUrl = `${environment.base_url}/auth`;
    this._recoverPassowrdUrl = `${environment.base_url}/recoverPassword`;
  }

  login(authValue: string, password: string, rememberUser: boolean) {
    const body = { authValue, password };
    return this.http.post<AuthResponse>(`${this._authUrl}/login`, body).pipe(tap((resp: AuthResponse) => {
      localStorage.setItem('ra_token', resp.ra_token);
      localStorage.setItem('rememberUser', rememberUser + '');
      if (rememberUser)
        localStorage.setItem('authValue', authValue);
    }))
  }

  logout() {
    const body = { ra_token: this.token == '' ? 'xxx' : this.token };
    return this.http.post<DefaultResponse<null>>(`${this._authUrl}/logout`, body).pipe(tap((resp: DefaultResponse<null>) => {
      localStorage.removeItem('ra_token');
    }));
  }

  renewToken() {
    const body = { ra_token: this.token == '' ? 'xxx' : this.token };
    return this.http.post<AuthResponse>(`${this._authUrl}/renewToken`, body).pipe(map((resp: AuthResponse) => {
      if (!resp.error)
        localStorage.setItem('ra_token', resp.ra_token);

      return !resp.error;
    }));
  }

  sendMailToRecoverPassword(email: string) {
    return this.http.post<DefaultResponse<null>>(`${this._recoverPassowrdUrl}/sendMail`, { email });
  }
}
