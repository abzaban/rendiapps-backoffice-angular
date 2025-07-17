import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { EnterprisesPage } from './submodules/empresas/enterprises.page';
import { EnterprisesTableComponent } from './submodules/empresas/components/enterprises-table/enterprises-table.component';
import { ToggleAddEditEnterpriseComponent } from './submodules/empresas/components/toggle-add-edit-enterprise/toggle-add-edit-enterprise.component';

import { StationsPage } from './submodules/estaciones/stations.page';
import { StationsTableComponent } from './submodules/estaciones/components/stations-table/stations-table.component';
import { ToggleAddEditStationComponent } from './submodules/estaciones/components/toggle-add-edit-station/toggle-add-edit-station.component';

import { UsersPage } from './submodules/usuarios/users.page';
import { UsersTableComponent } from './submodules/usuarios/components/users-table/users-table.component';
import { ToggleAddEditUserComponent } from './submodules/usuarios/components/toggle-add-edit-user/toggle-add-edit-user.component';

import { ShowCellphonesComponent } from './components/show-cellphones/show-cellphones.component';
import { EditPasswordComponent } from './submodules/usuarios/components/edit-password/edit-password.component';

@NgModule({
  declarations: [
    // submodule enterprises
    EnterprisesPage,
    EnterprisesTableComponent,
    ToggleAddEditEnterpriseComponent,

    // submodule stations
    StationsPage,
    StationsTableComponent,
    ToggleAddEditStationComponent,

    // submodule users
    UsersPage,
    UsersTableComponent,
    ToggleAddEditUserComponent,

    // generic components
    ShowCellphonesComponent,
     EditPasswordComponent
  ],
  imports: [SharedModule],
})
export class SettingsModule { }
