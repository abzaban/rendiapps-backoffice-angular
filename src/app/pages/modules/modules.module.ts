import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { SettingsModule } from './modules/configuraciones/settings.module';
import { CollectsBetweenStationsModule } from './modules/cobranzas-entre-estaciones/collects-between-stations.module';
import { FinancesModule } from './modules/finanzas/finances.module';
import { HumanResourcesModule } from './modules/recursos-humanos/human-resources.module';

@NgModule({
  imports: [SharedModule, SettingsModule, CollectsBetweenStationsModule, FinancesModule, HumanResourcesModule],
})
export class ModulesModule { }
