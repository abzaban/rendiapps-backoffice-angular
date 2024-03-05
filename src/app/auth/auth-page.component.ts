import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

import { fadeAnimation } from 'src/app/animations/animations';

@Component({
  selector: 'auth-layout-component',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  animations: [fadeAnimation],
})
export class AuthPage {
  constructor(private contexts: ChildrenOutletContexts) { }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
