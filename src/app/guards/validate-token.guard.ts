import { Injectable } from '@angular/core';

import { CanActivate, CanLoad, Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ValidateTokenGuard implements CanActivate, CanLoad {
  constructor(private _router: Router, private _authService: AuthService) { }

  canActivate(): Observable<boolean> | boolean {
    return this._authService.renewToken().pipe(tap((valid) => {
      if (!valid)
        this._router.navigateByUrl('/autenticacion');
    }));
  }

  canLoad(): Observable<boolean> | boolean {
    return this._authService.renewToken().pipe(tap((valid) => {
      if (!valid)
        this._router.navigateByUrl('/autenticacion');
    }));
  }
}
