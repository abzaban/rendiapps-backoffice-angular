import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { SnackbarStatusDirective } from '../directives/snackbar-status.directive';

import { CustomMatPaginatorIntlProvider } from '../providers/custom-mat-paginator-intl.provider';

import { SnackbarNotificationComponent } from './snackbars/notification/snackbar-notification.component';
import { SnackbarActionsComponent } from './snackbars/actions/snackbar-actions.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AccordionComponent } from './sidebar/accordion/accordion.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FilterInputComponent } from './filter-input/filter-input.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

@NgModule({
  declarations: [
    // directives
    SnackbarStatusDirective,

    // components
    SnackbarNotificationComponent,
    SnackbarActionsComponent,
    SidebarComponent,
    AccordionComponent,
    HeaderComponent,
    FooterComponent,
    NopagefoundComponent,
    FilterInputComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    MatListModule,
    MatStepperModule,
    NgxSpinnerModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    NgxMatFileInputModule,
  ],
  exports: [
    /*** Angular Modules ***/
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,

    /*** Material Modules ***/
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    MatListModule,
    MatStepperModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatTabsModule,
    MatGridListModule,
    MatAutocompleteModule,
    ScrollingModule,

    /*** Ngx Modules ***/
    NgxSpinnerModule,
    NgxMatSelectSearchModule,
    NgxMatFileInputModule,

    /** Components ***/
    SnackbarStatusDirective,
    SnackbarNotificationComponent,
    SidebarComponent,
    AccordionComponent,
    HeaderComponent,
    FooterComponent,
    FilterInputComponent
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntlProvider,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES',
    },
  ],
})
export class SharedModule { }
