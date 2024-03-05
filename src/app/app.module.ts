import { NgModule, APP_INITIALIZER } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

import { SnackbarProvider } from './providers/snackbar.provider';
import { SidebarProvider } from './providers/sidebar.provider';
import { LocationProvider } from './providers/location.provider';
import { ValidateProvider } from './providers/validate.provider';
import { FilterProvider } from './providers/filter.provider';
import { SortProvider } from './providers/sort.provider';
import { FormatProvider } from './providers/format.provider';
import { DownloadProvider } from './providers/download.provider';

import { AuthService } from './services/auth.service';
import { ModuleService } from './services/module.service';
import { TownService } from './services/town.service';
import { UserService } from './services/user.service';
import { EnterpriseService } from './services/enterprise.service';
import { StationService } from './services/station.service';
import { CollectService } from './services/collect.service';
import { WalletService } from './services/wallet.service';
import { DepartmentService } from './services/department.service';
// import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';

function initServicesFactory(
  //Providers
  _snackbarProvider: SnackbarProvider,
  _sidebarProvider: SidebarProvider,
  _locationProvider: LocationProvider,
  _validateProvider: ValidateProvider,
  _filterProvider: FilterProvider,
  _sortProvider: SortProvider,
  _formatProvider: FormatProvider,
  _downloadProvider: DownloadProvider,

  //Services
  _authService: AuthService,
  _moduleService: ModuleService,
  _townService: TownService,
  _userService: UserService,
  _enterpriseService: EnterpriseService,
  _stationService: StationService,
  _collectService: CollectService,
  _walletService: WalletService,
  _departmentService: DepartmentService,
) {
  return () => { };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    // BreadcrumbModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initServicesFactory,
      multi: true,
      deps: [
        // providers
        SnackbarProvider,
        SidebarProvider,
        LocationProvider,
        ValidateProvider,
        FilterProvider,
        SortProvider,
        FormatProvider,
        DownloadProvider,

        // services
        // BreadcrumbService,
        AuthService,
        ModuleService,
        TownService,
        UserService,
        EnterpriseService,
        StationService,
        CollectService,
        WalletService,
        DepartmentService,
      ],
    },
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule { }
