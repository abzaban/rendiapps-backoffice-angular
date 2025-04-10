import { Injectable } from '@angular/core';

import { Location } from '@angular/common';

import { BehaviorSubject, Observable } from 'rxjs';

import { default as data } from '../resources/menus.json';

@Injectable({
  providedIn: 'root',
})
export class LocationProvider {
  private menus!: any;
  private locationListeners!: BehaviorSubject<String>;
  location$obs!: Observable<String>;

  constructor(private location: Location) {
    this.menus = data.menus;
    this.setCurrentLocation();
  }

  getModulesFromLocation() {
    return this.menus[`${this.locationListeners.value}`];
  }

  setCurrentLocation($loc = '') {
    if ($loc != '') {
      this.locationListeners.next($loc);
      return;
    }

    var currentModule;
    var path = this.location.path().split('/');

    if (path[3] == undefined)
      currentModule = 'inicio';
    else
      currentModule = path[3];

    if (this.locationListeners == null) {
      this.locationListeners = new BehaviorSubject<String>(currentModule);
      this.location$obs = this.locationListeners.asObservable();
    } else
      this.locationListeners.next(currentModule);
  }
}
