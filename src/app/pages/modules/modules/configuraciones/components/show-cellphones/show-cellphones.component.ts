import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'show-cellphones-component',
  templateUrl: './show-cellphones.component.html',
  styleUrls: ['./show-cellphones.component.scss']
})
export class ShowCellphonesComponent {
  private _title: string;
  private _cellphones: string[];

  get title() {
    return this._title;
  }

  get cellphones() {
    return this._cellphones;
  }

  constructor(
    private _dialogRef: MatDialogRef<ShowCellphonesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._title = this.data.title;
    this._cellphones = this.data.cellphones;
  }

  close() {
    this._dialogRef.close();
  }
}
