import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { NEW_FRIEND, USER_NAME, FRIEND_REQUEST, FRIEND_RESPONSE } from 'src/app/share/template/constant';
import { CookieService } from 'ngx-cookie-service';
import { FriendReponsePacket, FriendRequestPacket } from '../share/template/pojo';
import { ShareService } from '../share/service/share.service';

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
            <add-friend *ngIf="this.selectedMenu === 'friends' && this.selectedFriend === this.newFriendConstant"></add-friend>
        </div>
    </div>
    `
})
export class MainInterfaceComponent implements OnDestroy {
    public selectedMenu = 'comments';
    public selectedFriend = '';
    public selectedComment = '';

    public newFriendConstant = NEW_FRIEND;

    public friendAdded = new EventEmitter<boolean>();
    public selectedMenuChange = new EventEmitter<string>();

    private webSocket: WebSocket;
    private isApprove = new EventEmitter<FriendReponsePacket>();

    constructor(private cookieService: CookieService, private shareService: ShareService) {
        this.approveListener();
        const userName = this.tryGetUserName();
        this.webSocketListener(userName);
    }

    ngOnDestroy() {
        this.webSocket.close();
    }

    private tryGetUserName(): string {
        let count = 0;
        let canAdd = true;
        while (this.cookieService.get(USER_NAME) === undefined) {
            if (count >= 10) {
                console.log('get username timeout');
            }
            if (canAdd) {
                canAdd = false;
                count++;
            }
            setTimeout(() => {
                if (!canAdd) {
                    canAdd = true;
                }
            }, 500);
        }
        return this.cookieService.get(USER_NAME);
    }

    private webSocketListener(userName: string) {
        this.webSocket = new WebSocket('ws://localhost:8082/' + userName);

        this.webSocket.onopen = (eventMessage: MessageEvent) => {
            console.log('open success');
        };

        this.webSocket.onmessage = (eventMessage: MessageEvent) => {
            console.log(eventMessage.data);
            const packet = JSON.parse(eventMessage.data);
            switch (packet.command) {
                case FRIEND_REQUEST:
                    const friendRequestPacket = packet as FriendRequestPacket;
                    this.shareService.openAddFriendModal(friendRequestPacket.fromUserName, friendRequestPacket.verifyMess, this.isApprove);
                    break;
                case FRIEND_RESPONSE:
                    const friendReponsePacket = packet as FriendReponsePacket;
                    if (friendReponsePacket.approved) {
                        this.friendAdded.emit(true);
                    }
                    break;
            }
        };

        this.webSocket.onclose = (eventMessage: CloseEvent) => {
            console.log('close success');
        };
    }

    private approveListener() {
        this.isApprove.subscribe(response => {
            this.webSocket.send(JSON.stringify(response));
        });
    }
}
