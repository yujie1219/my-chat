import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpService } from '../share/service/http.service';
import { Result, User, Token } from '../share/template/pojo';
import { ShareService } from '../share/service/share.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: `./login.component.html`,
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public loginForm: FormGroup = new FormGroup({
        userName: new FormControl('', this.isNullOrEmpty()),
        password: new FormControl('', this.isNullOrEmpty())
    });

    public register = false;

    public get userName() {
        return this.loginForm.get('userName');
    }

    public get password() {
        return this.loginForm.get('password');
    }

    constructor(private httpService: HttpService, private shareService: ShareService,
        // tslint:disable-next-line:align
        private router: Router) {

    }

    public async login() {
        let result: Result<Token> = null;
        const user: User = {
            userName: this.userName.value,
            password: this.password.value
        };
        try {
            if (this.register) {
                result = await this.httpService.registerApi(user);
            } else {
                result = await this.httpService.loginApi(user);
            }
            if (result && result.value) {
                const token: Token = result.value;
                this.shareService.saveToken(token, user.userName);

                this.router.navigate(['../chat']);
            } else if (result.errorMessage) {
                this.shareService.openErrorModal('登录失败', result.errorMessage);
            }
        } catch (e) {
            this.shareService.openErrorModal('登录失败', e.error.errorMessage);
        }
    }

    public focus(control: FormControl) {
        control.markAsUntouched();
    }

    private isNullOrEmpty(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value: string = control.value;
            if (!value || value.trim().length === 0) {
                return { nullOrEmpty: true };
            }
            return null;
        };
    }
}
