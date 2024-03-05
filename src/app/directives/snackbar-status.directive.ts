import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[status-snackbar]'
})
export class SnackbarStatusDirective {
  htmlElement!: ElementRef<HTMLElement>;

  @Input() set statusSB(value: string) {
    switch (value) {
      case 'done':
        this.htmlElement.nativeElement.style.color = "#0cad78";
        break;
      case 'error':
        this.htmlElement.nativeElement.style.color = "#f96c4a";
        break;
    }
  }

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }
}
