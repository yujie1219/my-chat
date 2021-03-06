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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddFriendModalComponent } from './component/modal/addFriendModal.component';
import { MaskLayerComponent } from './component/maskLayer/maskLayer.component';

export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
];

@NgModule({
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ErrorModalComponent,
        AddFriendModalComponent,
        MaskLayerComponent
    ],
    exports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MaskLayerComponent
    ],
    providers: [
        HttpService,
        CookieService,
        ShareService,
        httpInterceptorProviders
    ],
    entryComponents: [
        ErrorModalComponent,
        AddFriendModalComponent,
        MaskLayerComponent
    ]
})
export class ShareModule {

}
