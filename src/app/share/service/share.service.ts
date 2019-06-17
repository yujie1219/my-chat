import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from '../component/modal/errorModal.component';
import { Token } from '../template/pojo';
import { ACCESS_TOKEN, ACCESS_TOKEN_TIME, REFRESH_TOKEN, USER_NAME } from '../template/constant';
import { CookieService } from 'ngx-cookie-service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

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

    public saveToken(token: Token, userName: string) {
        const expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + (30 * 60 * 1000));
        this.cookieService.set(ACCESS_TOKEN, token.accessToken, expiresDate);
        console.log(expiresDate.toString());
        this.cookieService.set(ACCESS_TOKEN_TIME, expiresDate.toString(), expiresDate);

        expiresDate.setTime(expiresDate.getTime() - (30 * 60 * 1000) + (24 * 60 * 60 * 1000));
        this.cookieService.set(REFRESH_TOKEN, token.refreshToken, expiresDate);
        this.cookieService.set(USER_NAME, userName, expiresDate);
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
}
