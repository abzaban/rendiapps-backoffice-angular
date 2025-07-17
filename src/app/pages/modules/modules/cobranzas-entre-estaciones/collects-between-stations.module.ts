import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { CollectsReceivablePage } from './submodules/cobranzas-por-cobrar/collects-receivable.page';
import { CollectsReceivableTableComponent } from './submodules/cobranzas-por-cobrar/components/collects-receivable-table/collects-receivable-table.component';
import { AddCollectComponent } from './submodules/cobranzas-por-cobrar/components/add-collect/add-collect.component';

import { CollectsPayablePage } from './submodules/cobranzas-por-pagar/collects-payable.page';
import { CollectsPayableTableComponent } from './submodules/cobranzas-por-pagar/components/collects-payable-table/collects-payable-table.component';
import { ShowPaymentsComponent } from './submodules/cobranzas-por-pagar/components/show-payments/show-payments.component';
import { SavePaymentComponent } from './submodules/cobranzas-por-pagar/components/save-payment/save-payment.component';

import { AuthorizationCollectsPage } from './submodules/autorizacion-de-cobranzas/authorization-collects.page';
import { AuthorizationCollectsTableComponent } from './submodules/autorizacion-de-cobranzas/components/authorization-collects-table/authorization-collects-table.component';
import { RejectCollectComponent } from './submodules/autorizacion-de-cobranzas/components/reject-collect/reject-collect.component';

@NgModule({
  declarations: [
    // submódulo de cobranzas por cobrar
    CollectsReceivablePage,
    CollectsReceivableTableComponent,
    AddCollectComponent,

    // submódulo de cobranzas por pagar
    CollectsPayablePage,
    CollectsPayableTableComponent,
    ShowPaymentsComponent,
    SavePaymentComponent,

    // submódulo de cobranzas por pagar
    AuthorizationCollectsPage,
    AuthorizationCollectsTableComponent,
    RejectCollectComponent
  ],
  imports: [SharedModule],
})
export class CollectsBetweenStationsModule { }
