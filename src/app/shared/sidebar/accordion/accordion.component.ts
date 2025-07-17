import { Component, Input } from '@angular/core';
import { SidebarProvider } from '../../../providers/sidebar.provider';
import {
  mutateAccordionArrow,
  mutateAccordionExpand,
  mutateSidebarTitle,
} from '../../../animations/sidebar.animations';
import { Accordion } from '../interfaces/Accordion';

@Component({
  selector: 'lg-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  animations: [mutateAccordionArrow, mutateAccordionExpand, mutateSidebarTitle],
})
export class AccordionComponent {
  @Input() accordion!: Accordion;
  @Input() isSubmodule: boolean = false;

  expand(accordion: Accordion) {
    accordion.expanded = !accordion.expanded;
  }

  constructor(public sidebarProvider: SidebarProvider) { }

  get accordionClass() {
    return !this.isSubmodule
      ? 'sub-accordion-container'
      : 'accordion-container';
  }

  get activeAccordion() {
    return 'activeAccordion';
  }
}
