import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent } from '../shared/snackbars/notification/snackbar-notification.component';
import { SnackbarActionsComponent } from '../shared/snackbars/actions/snackbar-actions.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarProvider {
  constructor(private snackbar: MatSnackBar) { }

  openNotifications(msg: string, status: string) {
    this.snackbar.openFromComponent(SnackbarNotificationComponent, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mat-snack-bar-container', status.toLowerCase()],
      data: { message: msg, status: status },
    });
  }

  openActionsSnackbar(message: string, status: string, callback: any) {
    this.snackbar.openFromComponent(SnackbarActionsComponent, {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['actions-snackbar', status],
      data: { message: message, callback: callback, status },
    });
  }

  cancelAction() {
    this.snackbar.dismiss();
  }
}
