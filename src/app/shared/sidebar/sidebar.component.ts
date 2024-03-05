import { Component, Input } from '@angular/core';

import { SidebarProvider } from '../../providers/sidebar.provider';

import { mutateSidebar, mutateSidebarArrow, mutateSidebarTitle, mutateSidebarLockArrow } from '../../animations/sidebar.animations';

import { Accordion } from './interfaces/Accordion';

@Component({
  selector: 'lg-sidebar[accordions]',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    mutateSidebar,
    mutateSidebarArrow,
    mutateSidebarTitle,
    mutateSidebarLockArrow
  ],
})
export class SidebarComponent {
  @Input() logoPath!: string;
  @Input() accordions!: Accordion[];

  constructor(public sidebarProvider: SidebarProvider) {
    if (window.innerWidth < 400)
      sidebarProvider.sidebarState.isOpen = false;

  }
}
