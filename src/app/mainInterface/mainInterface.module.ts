import { NgModule } from '@angular/core';
import { MainInterfaceComponent } from './mainInterface.component';
import { FriendLabelComponent } from './friendLabel/friendLabel.component';
import { ShareModule } from '../share/share.module';

@NgModule({
    declarations: [
        MainInterfaceComponent,
        FriendLabelComponent
    ],
    imports: [
        ShareModule
    ]
})
export class MainInterfaceModule {

}
