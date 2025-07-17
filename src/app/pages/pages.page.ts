import { Component } from '@angular/core';

import { LocationProvider } from '../providers/location.provider';

@Component({
  selector: 'pages-page',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage {
  private _accordions: any = [];

  get accordions() {
    return this._accordions;
  }

  constructor(private _locationProvider: LocationProvider) {
    this._locationProvider.location$obs.subscribe(() => {
      this._accordions = this._locationProvider.getModulesFromLocation();
    });
  }
}
