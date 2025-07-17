import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ModulesModule } from './modules/modules.module';

import { PagesPage } from './pages.page';
import { ModulesPage } from './modules/modules.page';
import { ProfilePage } from './profile/profile.component';

import { ModuleCardComponent } from './modules/components/module-card/module-card.component';

@NgModule({
  declarations: [
    PagesPage,
    ModulesPage,
    ProfilePage,
    ModuleCardComponent,
  ],
  imports: [CommonModule, SharedModule, ModulesModule],
})
export class PagesModule { }
