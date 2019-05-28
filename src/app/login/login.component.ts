import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpService } from '../share/service/http.service';
import { Result, User } from '../share/template/pojo';
import { Token } from '@angular/compiler';

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
    public modalDisplay = false;
    public modalTitle: string;
    public modalContent: string;

    public get userName() {
        return this.loginForm.get('userName');
    }

    public get password() {
        return this.loginForm.get('password');
    }

    constructor(private httpService: HttpService) {

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
                console.log(result.value);
                const token: Token = result.value;
            } else if (result.errorMessage) {
                console.log(result.errorMessage);
            }
        } catch (e) {
            this.modalDisplay = true;
            this.modalTitle = '登录失败';
            this.modalContent = e.error.errorMessage;
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
