import { Component, EventEmitter } from '@angular/core';
import { NEW_FRIEND } from 'src/app/share/template/constant';

@Component({
    template: `
    <div style="height:100%;">
        <div style="width:10%; height:100%; display:inline-block; vertical-align: top;">
            <user-label (menuChange)="this.selectedMenu=$event;" [selectedMenuChange]="selectedMenuChange"></user-label>
        </div>
        <div style="width:20%; height:100%; display:inline-block; vertical-align: top;">
            <comment-label *ngIf="this.selectedMenu === 'comments'" [oldSelectedComment]="this.selectedComment"></comment-label>
            <friend-label *ngIf="this.selectedMenu === 'friends'"
                (selectedFriend)="this.selectedFriend=$event;"
                (selectedComment)="this.selectedComment=$event;this.selectedMenuChange.emit('comments')"
                [oldSelectedFriend]="selectedFriend" [friendAdded]="friendAdded"></friend-label>
        </div>
        <div style="width:70%; height:100%; display:inline-block; vertical-align: top;">
            <add-friend *ngIf="this.selectedMenu === 'friends' && this.selectedFriend === this.newFriendConstant"
                [friendAdded]="friendAdded"></add-friend>
        </div>
    </div>
    `
})
export class MainInterfaceComponent {
    public selectedMenu = 'comments';
    public selectedFriend = '';
    public selectedComment = '';

    public newFriendConstant = NEW_FRIEND;

    public friendAdded = new EventEmitter<boolean>();
    public selectedMenuChange = new EventEmitter<string>();
}
