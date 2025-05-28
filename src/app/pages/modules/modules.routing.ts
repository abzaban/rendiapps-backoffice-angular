import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ModulesPage } from './modules.page';

const childRoutes: Routes = [
  {
    path: '',
    component: ModulesPage,
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('./modules/configuraciones/settings.routing').then(m => m.SettingsRoutingModule)
  },
  {
    path: 'cobranzas-entre-estaciones',
    loadChildren: () => import('./modules/cobranzas-entre-estaciones/collects-between-stations.routing').then(m => m.CollectsBetweenStationsRoutingModule)
  },
  {
    path: 'finanzas',
    loadChildren: () => import('./modules/finanzas/finances.routing').then(m => m.FinancesRoutingModule)
  },
  {
    path: 'recursos-humanos',
    loadChildren: () => import('./modules/recursos-humanos/human-resources.routing').then(m => m.HumanResourcesRoutingModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }