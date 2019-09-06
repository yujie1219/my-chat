import { Injectable, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from '../component/modal/errorModal.component';
import { Token, FriendReponsePacket } from '../template/pojo';
import { ACCESS_TOKEN, ACCESS_TOKEN_TIME, REFRESH_TOKEN, USER_NAME } from '../template/constant';
import { CookieService } from 'ngx-cookie-service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AddFriendModalComponent } from '../component/modal/addFriendModal.component';

@Injectable()
export class ShareService {
    constructor(private modalService: BsModalService, private cookieService: CookieService) { }

    public openErrorModal(errorTitle: string, errorMessage: string) {
        const errorModalRef = this.modalService.show(ErrorModalComponent);
        if (errorMessage && errorMessage.trim().length > 0) {
            errorModalRef.content.errorMessage = errorMessage;
        }
        if (errorTitle && errorTitle.trim().length > 0) {
            errorModalRef.content.errorTitle = errorTitle;
        }
    }

    public openAddFriendModal(name: string, verifyMess: string, isApprove: EventEmitter<FriendReponsePacket>) {
        const errorModalRef = this.modalService.show(AddFriendModalComponent);
        if (name && name.trim().length > 0) {
            errorModalRef.content.name = name;
        }
        if (verifyMess && verifyMess.trim().length > 0) {
            errorModalRef.content.verifyMess = verifyMess;
        }
        errorModalRef.content.isApprove = isApprove;
    }

    public saveToken(token: Token, userName: string) {
        const expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + (30 * 60 * 1000));
        this.cookieService.set(ACCESS_TOKEN, token.accessToken, expiresDate);
        this.cookieService.set(ACCESS_TOKEN_TIME, expiresDate.toString(), expiresDate);

        expiresDate.setTime(expiresDate.getTime() - (30 * 60 * 1000) + (24 * 60 * 60 * 1000));
        this.cookieService.set(REFRESH_TOKEN, token.refreshToken, expiresDate);
        this.cookieService.set(USER_NAME, userName, expiresDate);
    }

    public removeToken() {
        this.cookieService.delete(ACCESS_TOKEN);
        this.cookieService.delete(ACCESS_TOKEN_TIME);
        this.cookieService.delete(REFRESH_TOKEN);
        this.cookieService.delete(USER_NAME);
    }

    public isEmpty(obj: any): boolean {
        return obj === undefined || obj === null || obj === '' || obj.length === 0;
    }

    public isNullOrEmpty(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value: string = control.value;
            if (!value || value.trim().length === 0) {
                return { nullOrEmpty: true };
            }
            return null;
        };
    }

    public verifyMessageLength(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value: string = control.value;
            if (value && value.trim().length > 30) {
                return { tooLong: true };
            }
            return null;
        };
    }
}
