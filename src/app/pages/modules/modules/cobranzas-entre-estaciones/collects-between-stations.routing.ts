import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { CollectsReceivablePage } from './submodules/cobranzas-por-cobrar/collects-receivable.page';
import { CollectsPayablePage } from './submodules/cobranzas-por-pagar/collects-payable.page';
import { AuthorizationCollectsPage } from './submodules/autorizacion-de-cobranzas/authorization-collects.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cobranzas-por-cobrar',
  },
  {
    path: 'cobranzas-por-cobrar',
    component: CollectsReceivablePage
  },
  {
    path: 'cobranzas-por-pagar',
    component: CollectsPayablePage
  },
  {
    path: 'autorizacion-de-cobranzas',
    component: AuthorizationCollectsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectsBetweenStationsRoutingModule { }
