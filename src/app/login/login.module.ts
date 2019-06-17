import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ShareModule } from '../share/share.module';

@NgModule({
    imports: [
        ShareModule,
        CheckboxModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {

}
