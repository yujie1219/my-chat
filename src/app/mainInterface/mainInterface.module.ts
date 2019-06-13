import { NgModule } from '@angular/core';
import { MainInterfaceComponent } from './mainInterface.component';
import { FriendLabelComponent } from './friendLabel/commentLabel.component';
import { ShareModule } from '../share/share.module';
import { UserLabelComponent } from './userLabel/userLabel.component';

@NgModule({
    declarations: [
        MainInterfaceComponent,
        FriendLabelComponent,
        UserLabelComponent
    ],
    imports: [
        ShareModule
    ]
})
export class MainInterfaceModule {

}
