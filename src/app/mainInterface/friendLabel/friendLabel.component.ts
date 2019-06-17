import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'friend-label',
    templateUrl: './friendLabel.component.html',
    styles: [`
        .friend-label-container{
            flex-flow: column wrap;
            overflow-y: auto;
            height: 100%;
            padding: 0px;
            background-color:gainsboro;
        }

        .friend-label{
            height: 80px;
            cursor: pointer;
        }

        .friend-label:hover{
            background-color: gray !important;
        }

        .friend-categray{
            border-bottom: 1px solid darkgrey;
            width: 100%;
            font-size: 12px;
            padding: 5px;
            color: darkgray;
        }

        img{
            height: 75px;
            padding: 5px
        }

        .friend-name{
            font-size: 18px;
            padding-left: 5px;
        }
    `]
})
export class FriendLabelComponent {
    @Output()
    public selectedFriend = new EventEmitter<string>();

    public selectFriend(friendName: string) {
        this.selectedFriend.emit(friendName);
    }
}
