import { animate, query, stagger, style, transition, trigger } from "@angular/animations";



export const fadeAnimation = trigger('fade', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
    ])
])

export const listAnimation = trigger('listAnimation', [
    transition('* => *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(-50px)' }),
            stagger('50ms', [
                animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ], { optional: true })
    ])
])