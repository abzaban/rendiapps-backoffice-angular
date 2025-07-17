import { Component, HostListener } from '@angular/core';

import { LocationProvider } from './providers/location.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular.rendiapps2.0.cliente';

  constructor(private _locationProvider: LocationProvider) {
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this._locationProvider.setCurrentLocation();
  }
}
