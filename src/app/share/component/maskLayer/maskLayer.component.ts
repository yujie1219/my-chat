import { Component, Input } from '@angular/core';

@Component({
    selector: 'mask-layer',
    template: `
        <div class="mask-layer-wrapper" *ngIf="show">
            <img src="../../../../assets/img/loading.gif" />
        </div>
    `,
    styles: [`
        .mask-layer-wrapper {
            position: absolute;
            z-index: 10;
            height:100%;
            width:100%;
            background-color: black;
            opacity:0.5;
        }

        img {
            display: block;
            margin: 0 auto;
        }
    `]
})
export class MaskLayerComponent {
    @Input() show = false;
}
