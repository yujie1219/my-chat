import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpService } from '../share/http.service';

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

    constructor(private httpService: HttpService) {

    }

    public async login() {
        console.log(this.loginForm.value);
        let token = '';
        try {
            if (this.register) {
                token = await this.httpService.registerApi(this.userName.value, this.password.value);
            } else {
                token = await this.httpService.loginApi(this.userName.value, this.password.value);
            }
            console.log(token);
        } catch (e) {
            console.log(e);
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
