import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ACCESS_TOKEN } from '../template/constant';

@Injectable()
export class RquestInterceptor implements HttpInterceptor {

    constructor(private cookie: CookieService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.cookie.get(ACCESS_TOKEN)) {
            const authReq = req.clone({
                setHeaders: {}
            });
            return next.handle(authReq);
        }

        return next.handle(req);
    }

}
