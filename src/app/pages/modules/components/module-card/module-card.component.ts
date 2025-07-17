import { Component, Input } from '@angular/core';

import { LocationProvider } from '../../../../providers/location.provider';

import { Module } from '../../interfaces/Module';

@Component({
  selector: 'module-card-component',
  templateUrl: './module-card.component.html',
  styleUrls: ['./module-card.component.scss'],
})
export class ModuleCardComponent {
  @Input() public module!: Module;

  constructor(private _locationProvider: LocationProvider) { }

  navigateTo() {
    this._locationProvider.setCurrentLocation(this.module.uri.trim());
  }
}
