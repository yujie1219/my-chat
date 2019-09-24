import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'mask-layer',
    template: `
        <div class="mask-layer-wrapper" *ngIf="show">
        </div>
        <img src="../../../../assets/img/loading.gif" *ngIf="show"
            [style.left]="sanitizer.bypassSecurityTrustStyle('calc(50% - 120px)')"
            [style.top]="sanitizer.bypassSecurityTrustStyle('calc(50% - 120px)')"/>
    `,
    styles: [`
        .mask-layer-wrapper {
            position: fixed;
            z-index: 10;
            height:100%;
            width:100%;
            background-color: black;
            opacity:0.5;
        }

        img {
            display: block;
            margin: 0 auto;
            position: fixed;
        }
    `]
})
export class MaskLayerComponent {
    @Input() show = false;

    constructor(public sanitizer: DomSanitizer) {

    }
}
