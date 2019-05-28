import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ShareModule } from '../share/share.module';

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        ShareModule,
        CheckboxModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {

}
