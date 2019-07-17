import { NgModule } from '@angular/core';
import { MainInterfaceComponent } from './mainInterface.component';
import { CommentLabelComponent } from './commentLabel/commentLabel.component';
import { ShareModule } from '../share/share.module';
import { UserLabelComponent } from './userLabel/userLabel.component';
import { FriendLabelComponent } from './friendLabel/friendLabel.component';
import { AddFriendComponent } from './addFriend/addFriend.component';
import { ChatInterfaceComponent } from './chatInterface/chatInterface.component';

@NgModule({
    declarations: [
        MainInterfaceComponent,
        CommentLabelComponent,
        FriendLabelComponent,
        UserLabelComponent,
        AddFriendComponent,
        ChatInterfaceComponent
    ],
    imports: [
        ShareModule
    ]
})
export class MainInterfaceModule {

}
