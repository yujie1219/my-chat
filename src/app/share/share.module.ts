import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './service/http.service';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './component/modal/errorModal.component';
import { ShareService } from './service/share.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/authInterceptor.service';

export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
];

@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ErrorModalComponent
    ],
    exports: [
        CommonModule,
        ButtonModule
    ],
    providers: [
        HttpService,
        CookieService,
        ShareService,
        httpInterceptorProviders
    ],
    entryComponents: [
        ErrorModalComponent
    ]
})
export class ShareModule {

}
