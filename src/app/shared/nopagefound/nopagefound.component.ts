import { Component } from '@angular/core';

@Component({
  selector: 'nopagefound-component',
  templateUrl: './nopagefound.component.html',
  styleUrls: [ './nopagefound.component.scss' ]
})
export class NopagefoundComponent {

  year = new Date().getFullYear();

}
