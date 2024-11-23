import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DepartmentsPage } from './submodules/departamentos/departments.page';
import { DepartmentsTableComponent } from './submodules/departamentos/components/departments-table/departments-table.component';
import { ToggleAddEditDepartmentComponent } from './submodules/departamentos/components/toggle-add-edit-department/toggle-add-edit-department.component';

@NgModule({
  declarations: [
    // submodule departments
    DepartmentsPage,
    DepartmentsTableComponent,
    ToggleAddEditDepartmentComponent,
  ],
  imports: [SharedModule],
})
export class HumanResourcesModule { }
