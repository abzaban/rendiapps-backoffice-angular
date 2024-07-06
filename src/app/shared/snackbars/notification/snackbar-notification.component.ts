import { Component, Inject } from '@angular/core';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'snackbar-notification-component',
  templateUrl: './snackbar-notification.component.html',
  styleUrls: ['./snackbar-notification.component.scss']
})
export class SnackbarNotificationComponent {

  constructor(@Inject (MAT_SNACK_BAR_DATA) public data: any) {}

  get getIcon() {
    switch (this.data.status) {
      case 'Success':
        return 'done';
      case 'Error':
        return 'error';
    }
    return 'Success'
  }
}
