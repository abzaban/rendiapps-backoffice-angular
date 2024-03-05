import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this._authService.logout().subscribe(() => {
      this.router.navigateByUrl('/autenticacion');
    });
  }
}
