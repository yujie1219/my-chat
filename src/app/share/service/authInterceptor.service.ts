import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ACCESS_TOKEN, USER_NAME, REFRESH_TOKEN, ACCESS_TOKEN_TIME } from '../template/constant';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Result, Token } from '../template/pojo';
import { ShareService } from './share.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isProcessing = false;

    constructor(private cookie: CookieService, private router: Router,
        // tslint:disable-next-line:align
        private httpService: HttpService, private shareService: ShareService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const accessToken = this.cookie.get(ACCESS_TOKEN);
        const accessTokenTime = this.cookie.get(ACCESS_TOKEN_TIME);
        const refreshToken = this.cookie.get(REFRESH_TOKEN);
        const userName = this.cookie.get(USER_NAME);

        const isLoginOrRegister = req.url.indexOf('/user/login') !== -1 || req.url.indexOf('/user/register') !== -1;

        // if (refreshToken) {
        //     const expiresDate = new Date();
        //     expiresDate.setTime(expiresDate.getTime() + (5 * 60 * 1000));
        //     if (new Date(accessTokenTime) < expiresDate) {
        //         this.getAccessToken(userName, refreshToken);
        //     }
        //     if (!this.isProcessing) {
        //         if (accessToken) {
        //             const authReq = req.clone({
        //                 setHeaders: { Authorization: accessToken, UserName: userName }
        //             });
        //             return next.handle(authReq);
        //         } else {
        //             this.getAccessToken();
        //         }
        //     } else {
        //         // wait until isProcessing to false then create authReq
        //     }
        // } else {
        //     if (isLoginOrRegister) {
        //         return next.handle(req);
        //     } else {
        //         this.router.navigate(['/login']);
        //     }
        // }

        return next.handle(req);
    }

    private getAccessToken(userName: string, refreshToken: string): Promise<any> {
        this.isProcessing = true;
        return this.httpService.getAccessToken(userName, refreshToken).then((result: Result<Token>) => {
            const token: Token = result.value;
            this.shareService.saveToken(token, userName);

            this.isProcessing = false;
        });
    }

}
