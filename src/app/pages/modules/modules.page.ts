import { Component } from '@angular/core';

import { ModuleService } from '../../services/module.service';

import { LocationProvider } from '../../providers/location.provider';

import { Module } from './interfaces/Module';

import { DefaultResponse } from '../../interfaces/DefaultResponse';

@Component({
  selector: 'modules-page',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesPage {
  private _modules: Module[];

  get modules() {
    return this._modules;
  }

  constructor(private _moduleService: ModuleService, private _locationProvider: LocationProvider) {
    this._modules = [];
    this._moduleService.getModulesOfUser().subscribe((resp: DefaultResponse<Module[]>) => {
      this._modules = resp.payload;
    });

    this._locationProvider.setCurrentLocation();
  }
}
