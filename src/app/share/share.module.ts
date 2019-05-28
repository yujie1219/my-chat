import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './service/http.service';
import { CookieService } from 'ngx-cookie-service';
import { ModalComponent } from './component/modal/modal.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        DialogModule,
        ButtonModule
    ],
    declarations: [
        ModalComponent
    ],
    exports: [
        CommonModule,
        ButtonModule,
        ModalComponent
    ],
    providers: [
        HttpService,
        CookieService
    ]
})
export class ShareModule {

}
