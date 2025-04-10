import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { DepartmentsPage } from './submodules/departamentos/departments.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'departamentos',
    },
    {
        path: 'departamentos',
        component: DepartmentsPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HumanResourcesRoutingModule { }
