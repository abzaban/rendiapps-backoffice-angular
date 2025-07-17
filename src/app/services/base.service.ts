import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  get token() {
    return localStorage.getItem('ra_token') || '';
  }
}
