import { Component, Input } from '@angular/core';

@Component({
    selector: 'custom-modal',
    template: `
        <p-dialog [(visible)]="display">
            <p-header>{{title}}</p-header>
            {{message}}
            <p-footer>
                <button pButton type="button" label="确定" (click)="sureFunc()"></button>
                <ng-container *ngIf="!onlyShowSureBtn">
                    <button pButton type="button" label="取消" class="ui-button-secondary" (click)="cancelFunc()"></button>
                </ng-container>
            </p-footer>
        </p-dialog>
    `
})
export class ModalComponent {
    @Input() public display = false;
    @Input() public title: string;
    @Input() public message: string;
    @Input() public onlyShowSureBtn = false;

    @Input() public sureFunc = () => {
        this.display = false;
    }
    @Input() public cancelFunc = () => {
        this.display = false;
    }
}
