import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';

import { MatSelect } from '@angular/material/select';

import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

import { CustomEmit, DataFilter } from 'src/app/shared/filter-input/interfaces/interfaces';

@Component({
  selector: 'filter-input-component[filter]',
  templateUrl: './filter-input.component.html'
})
export class FilterInputComponent implements OnInit, AfterViewInit, AfterContentInit {
  public dataCtrl: FormControl;
  public dataFilterCtrl: FormControl = new FormControl();
  public filteredData: ReplaySubject<any[]> = new ReplaySubject(1);
  public errorMsg: string;

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  @Input() filter!: DataFilter;
  @Output() itemSelected: EventEmitter<CustomEmit> =
    new EventEmitter<CustomEmit>();

  protected _onDestroy = new Subject<void>();

  constructor() {
    this.dataCtrl = new FormControl();
    this.errorMsg = '';
  }

  ngOnInit() {
    if (this.filter.required)
      this.dataCtrl = new FormControl('', [Validators.required]);

    this.filteredData.next(this.filter.items.slice());

    this.dataFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterData();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterContentInit() {
    if (this.filter.initialValue)
      this.filter.values.forEach((element: string, index: number) => {
        if (element == this.filter.initialValue) {
          this.dataCtrl.setValue(this.filter.items[index]);
          return;
        }
      });
  }

  protected setInitialValue() {
    this.filteredData
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {  
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a === b;
      });
  }

  protected filterData() {
    if (!this.filter) return;

    let search = this.dataFilterCtrl.value;
    if (!search) {
      this.filteredData.next(this.filter.items.slice());
      return;
    } else search = search.toLowerCase();

    this.filteredData.next(
      this.filter.items.filter((obj) => obj.toLowerCase().indexOf(search) > -1)
    );
  }

  emitSelectedItem() {
    this.validate();
    if (this.dataCtrl.invalid) return;
    this.itemSelected.emit({
      attribute: this.filter.attribute,
      item: this.dataCtrl.value,
      value: this.filter.values[this.filter.items.indexOf(this.dataCtrl.value)],
    });
  }

  validate() {
    if (this.filter.required && this.dataCtrl.value == '')
      this.errorMsg = 'Campo requerido';
    else
      this.errorMsg = '';
  }
}
