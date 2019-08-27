import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ShareService } from 'src/app/share/service/share.service';
import { HttpService } from 'src/app/share/service/http.service';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME } from 'src/app/share/template/constant';
import { FriendRequestPacket } from 'src/app/share/template/pojo';

@Component({
    selector: 'add-friend',
    template: `
        <form class="center-wrapper" [formGroup]="addFriendForm" autocomplete="off">
            <div class="form-group row"
                [style.margin-bottom]="userName.errors?.nullOrEmpty && (userName.touched || userName.dirty)?'0':'1rem'">
                <label class="col-md-2" for="userName">用户名</label>
                <input type="text" class="form-control col-md-6" id="userName" (focus)="focus(userName)" placeholder="请输入用户名"
                    formControlName="userName">
            </div>
            <div class="row">
                <div class="col-md-2"></div>
                <span *ngIf="userName.errors?.nullOrEmpty && (userName.touched || userName.dirty)"
                    class="control-error">
                    用户名不能为空
                </span>
            </div>
            <div class="form-group row">
                <label class="col-md-2" for="verifyMess">验证信息</label>
                <textarea rows="3" class="form-control col-md-6" id="verifyMess" formControlName="verifyMess">
                </textarea>
            </div>
        </form>
        <div style="text-align:center">
            <button class="btn btn-primary btn-left" (click)="addFriend()" [disabled]="!addFriendForm.valid">添加</button>
            <button class="btn btn-primary" (click)="reset()">重置</button>
        </div>
    `,
    styles: [`
        .center-wrapper{
            width: 80%;
            margin: 50px auto 0 auto;
        }

        .control-error{
            color: red;
            font-size: 0.8em;
            margin-bottom: 1rem;
        }

        .btn-left{
            margin-left: -150px;
            margin-right: 30px;
        }
    `]
})
export class AddFriendComponent {
    @Output()
    sendAddFriendRequest = new EventEmitter<FriendRequestPacket>();

    public addFriendForm: FormGroup = new FormGroup({
        userName: new FormControl('', this.shareService.isNullOrEmpty()),
        verifyMess: new FormControl('')
    });
    private currentUserName = this.cookieService.get(USER_NAME);

    public get userName() {
        return this.addFriendForm.get('userName');
    }

    constructor(private shareService: ShareService, private httpSerivce: HttpService, private cookieService: CookieService) {

    }

    public focus(control: FormControl) {
        control.markAsUntouched();
    }

    public addFriend() {
        const request: FriendRequestPacket = new FriendRequestPacket();
        request.senderUserName = this.currentUserName;
        request.receiverUserName = this.addFriendForm.get('userName').value;
        request.verifyMess = this.addFriendForm.get('verifyMess').value;
        this.sendAddFriendRequest.emit(request);
    }

    public reset() {
        this.addFriendForm.reset();
    }
}
