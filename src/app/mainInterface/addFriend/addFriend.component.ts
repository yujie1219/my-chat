import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ShareService } from 'src/app/share/service/share.service';

@Component({
    selector: 'add-friend',
    template: `
        <form class="center-wrapper" [formGroup]="addFriendForm">
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
    `]
})
export class AddFriendComponent {
    public addFriendForm: FormGroup = new FormGroup({
        userName: new FormControl('', this.shareService.isNullOrEmpty()),
        verifyMess: new FormControl('')
    });

    public get userName() {
        return this.addFriendForm.get('userName');
    }

    constructor(private shareService: ShareService) {

    }

    public focus(control: FormControl) {
        control.markAsUntouched();
    }
}
