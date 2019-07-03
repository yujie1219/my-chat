import { Component, Input, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FriendReponsePacket } from '../../template/pojo';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME } from '../../template/constant';

@Component({
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">{{name}}请求添加你为好友</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p *ngIf="verifyMess!=undefined && verifyMess.length>0">验证信息:{{verifyMess}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="confirm()">确认</button>
            <button type="button" class="btn btn-default" (click)="refuse()">拒绝</button>
        </div>
    `
})
export class AddFriendModalComponent {
    @Input() name = '某人';
    @Input() verifyMess: string;
    @Input() isApprove: EventEmitter<FriendReponsePacket>;

    private userName: string;

    constructor(public bsModalRef: BsModalRef, private cookieService: CookieService) {
        this.userName = this.cookieService.get(USER_NAME);
    }

    public confirm() {
        const friendReponsePacket = new FriendReponsePacket();
        friendReponsePacket.fromUserName = this.userName;
        friendReponsePacket.toUserName = this.name;
        friendReponsePacket.approved = true;
        this.isApprove.emit(friendReponsePacket);
        this.bsModalRef.hide();
    }

    public refuse() {
        const friendReponsePacket = new FriendReponsePacket();
        friendReponsePacket.fromUserName = this.userName;
        friendReponsePacket.toUserName = this.name;
        friendReponsePacket.approved = false;
        this.isApprove.emit(friendReponsePacket);
        this.bsModalRef.hide();
    }
}
