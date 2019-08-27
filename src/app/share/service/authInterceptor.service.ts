import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponseBase } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { ACCESS_TOKEN, USER_NAME, REFRESH_TOKEN, ACCESS_TOKEN_TIME } from '../template/constant';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Result, Token } from '../template/pojo';
import { ShareService } from './share.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // private isProcessing = false;

    constructor(private cookie: CookieService, private router: Router,
        // tslint:disable-next-line:align
        private httpService: HttpService, private shareService: ShareService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isLoginOrRegister = req.url.indexOf('/user/login') !== -1 ||
            req.url.indexOf('/user/register') !== -1 || req.url.indexOf('/auth/accessToken') !== -1;

        if (isLoginOrRegister) {
            return next.handle(req);
        } else {
            const refreshToken = this.cookie.get(REFRESH_TOKEN);

            if (refreshToken) {
                const accessToken = this.cookie.get(ACCESS_TOKEN);
                const accessTokenTime = this.cookie.get(ACCESS_TOKEN_TIME);
                const userName = this.cookie.get(USER_NAME);

                const expiresDate = new Date();
                expiresDate.setTime(expiresDate.getTime() + (5 * 60 * 1000));
                if (this.shareService.isEmpty(accessTokenTime) || new Date(accessTokenTime) < expiresDate) {
                    this.getAccessToken(userName, refreshToken);
                }
                // if (this.isProcessing) {

                // } else {
                //     return this.generateAuthReqAndHandleData(req, next, accessToken, userName);
                // }
                return this.generateAuthReqAndHandleData(req, next, accessToken, userName);
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    private generateAuthReqAndHandleData(req: HttpRequest<any>, next: HttpHandler, accessToken: string, userName: string) {
        const authReq = req.clone({
            setHeaders: { Authorization: accessToken, UserName: userName }
        });
        return next.handle(authReq).pipe(
            tap((event: any) => {
                return of(event);
            }, (error: any) => {
                if (error instanceof HttpResponseBase && error.status === 401) {
                    this.shareService.openErrorModal('请求失败!', '用户验证失败!');
                    this.router.navigate(['/login']);
                }
            })
        );
    }

    private getAccessToken(userName: string, refreshToken: string): Promise<any> {
        // this.isProcessing = true;
        return this.httpService.getAccessToken(userName, refreshToken).then((result: Result<Token>) => {
            const token: Token = result.value;
            this.shareService.saveToken(token, userName);

            // this.isProcessing = false;
        });
    }

}
