import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

/** SIDEBAR */

export const mutateSidebar = trigger('mutateSidebar', [
    state('close', style({ maxWidth: '82px' })),
    state('open', style({ maxWidth: '265px' })),
    transition('open => close, close => open', [
        group([
            query('@mutateSidebarArrowPosition', animateChild()), animate(250),
            query('@mutateSidebarTitle', animateChild()), animate(250)
        ])
    ])
]);

export const mutateSidebarArrow = trigger('mutateSidebarArrowLocked', [
    state('close', style({ transform: 'rotate(180deg)', })),
    state('open', style({ transform: 'rotate(0deg)', })),
    transition('close => open, open => close', animate(250))
])

export const mutateSidebarLockArrow = trigger('mutateSidebarArrowPosition', [
    state('close', style({ marginLeft: '0px' })),
    state('open', style({ marginLeft: '150px' })),
    transition('close => open, open => close', animate(250))
])

export const mutateSidebarTitle = trigger('mutateSidebarTitle', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
        animate('250ms', style({ opacity: 0 }))
    ])
])

/** ACCORDION */

export const mutateAccordionExpand = trigger('mutateAccordionExpand', [
    state('expanded', style({ maxHeight: '450px' })),
    state('closed', style({ maxHeight: '29px' })),
    transition('closed => expanded, expanded => closed', [
        group([query('@mutateAccordionArrow', animateChild(), { optional: true }), animate('350ms ease-in')])
    ])
])

export const mutateAccordionArrow = trigger('mutateAccordionArrow', [
    state('closed', style({ 'transform': 'rotate(0deg)' })),
    state('expanded', style({ 'transform': 'rotate(-180deg)' })),
    transition('closed => expanded, expanded => closed', animate(250)),
])
