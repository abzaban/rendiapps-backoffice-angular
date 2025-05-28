import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackbarProvider } from 'src/app/providers/snackbar.provider';
@Component({
  selector: 'app-actions',
  templateUrl: './snackbar-actions.component.html',
  styleUrls: ['./snackbar-actions.component.scss'],
})
export class SnackbarActionsComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackbar: SnackbarProvider
  ) {}

  cancel() {
    this.snackbar.cancelAction();
  }

  submit() {
    this.data.callback();
  }

  ngOnInit() {}
}
