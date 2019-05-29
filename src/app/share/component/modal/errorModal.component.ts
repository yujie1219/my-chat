import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">{{errorTitle}}</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{errorMessage}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">确认</button>
        </div>
    `
})
export class ErrorModalComponent {
    @Input() errorTitle = '错误信息';
    @Input() errorMessage = '服务器内部错误！';

    constructor(public bsModalRef: BsModalRef) { }
}
