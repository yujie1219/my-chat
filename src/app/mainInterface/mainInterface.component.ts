import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { NEW_FRIEND, USER_NAME, FRIEND_REQUEST, FRIEND_RESPONSE, MESSAGE_REQUEST, MESSAGE_RESPONSE } from 'src/app/share/template/constant';
import { CookieService } from 'ngx-cookie-service';
import { FriendReponsePacket, FriendRequestPacket, MessageRequestPacket, Message, MessageResponsePacket } from '../share/template/pojo';
import { ShareService } from '../share/service/share.service';
import { Subscription } from 'rxjs';

@Component({
    template: `
    <div style="height:100%;">
        <div style="width:10%; height:100%; display:inline-block; vertical-align: top;">
            <user-label (menuChange)="this.selectedMenu=$event;" [selectedMenuChange]="selectedMenuChange"></user-label>
        </div>
        <div style="width:20%; height:100%; display:inline-block; vertical-align: top;">
            <comment-label *ngIf="this.selectedMenu === 'comments'"
                [oldSelectedComment]="this.selectedComment"
                (selectedComment)="this.selectedComment=$event;"></comment-label>
            <friend-label *ngIf="this.selectedMenu === 'friends'"
                (selectedFriend)="this.selectedFriend=$event;"
                (selectedComment)="this.selectedComment=$event;this.selectedMenuChange.emit('comments')"
                [oldSelectedFriend]="selectedFriend" [friendAdded]="friendAdded"></friend-label>
        </div>
        <div style="width:70%; height:100%; display:inline-block; vertical-align: top;">
            <add-friend *ngIf="this.selectedMenu === 'friends' && this.selectedFriend === this.newFriendConstant"
                (sendAddFriendRequest)="sendAddFriendRequest($event);" [isApprove]="isApprove"></add-friend>
            <chat-interface *ngIf="this.selectedMenu === 'comments' && this.selectedComment !== ''"
                [selectedFriendName]="selectedComment" [sendMessageListener]="sendMessage"
                [getMessageListener]="getMessage" [getMessageResponseListener]="getMessageResponse"></chat-interface>
        </div>
    </div>
    `
})
export class MainInterfaceComponent implements OnDestroy {
    public selectedMenu = 'comments';
    public selectedFriend = '';
    public selectedComment = '';

    public newFriendConstant = NEW_FRIEND;

    public friendAdded = new EventEmitter<FriendReponsePacket>();
    public selectedMenuChange = new EventEmitter<string>();

    public sendMessage = new EventEmitter<Message>();
    private sendMessageSubscription: Subscription;

    public getMessage = new EventEmitter<Message>();
    public getMessageResponse = new EventEmitter<MessageResponsePacket>();

    private webSocket: WebSocket;
    private isApprove = new EventEmitter<FriendReponsePacket>();
    private isApproveSubscription: Subscription;

    constructor(private cookieService: CookieService, private shareService: ShareService) {
        this.approveListener();
        this.sendMessageListener();
        const userName = this.tryGetUserName();
        this.webSocketListener(userName);
    }

    ngOnDestroy() {
        this.webSocket.close();
        if (this.isApproveSubscription) {
            this.isApproveSubscription.unsubscribe();
        }
        if (this.sendMessageSubscription) {
            this.sendMessageSubscription.unsubscribe();
        }
    }

    public sendAddFriendRequest(request: FriendRequestPacket) {
        this.webSocket.send(JSON.stringify(request));
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
                    // tslint:disable-next-line:max-line-length
                    this.shareService.openAddFriendModal(friendRequestPacket.senderUserName, friendRequestPacket.verifyMess, this.isApprove);
                    break;
                case FRIEND_RESPONSE:
                    const friendReponsePacket = packet as FriendReponsePacket;
                    this.friendAdded.emit(friendReponsePacket);
                    break;
                case MESSAGE_REQUEST:
                    const messageRequestPacket = packet as MessageRequestPacket;
                    const message = messageRequestPacket.message;
                    if (this.selectedComment === messageRequestPacket.senderUserName) {
                        this.getMessage.emit(message);
                    } else {
                        // 在comment标签上增加一个未读标记(显示条数)
                        // 同时也可以在标签下方空白处显示最新内容
                    }
                    const messageResponse = new MessageResponsePacket();
                    messageResponse.messageId = message.messageId;
                    messageResponse.sendSucceed = true;
                    this.webSocket.send(JSON.stringify(messageResponse));
                    break;
                case MESSAGE_RESPONSE:
                    const messageResponsePacket = packet as MessageResponsePacket;
                    this.getMessageResponse.emit(messageResponsePacket);
            }
        };

        this.webSocket.onclose = (eventMessage: CloseEvent) => {
            console.log('close success');
        };
    }

    private approveListener() {
        this.isApproveSubscription = this.isApprove.subscribe(response => {
            this.webSocket.send(JSON.stringify(response));
        });
    }

    private sendMessageListener() {
        this.sendMessageSubscription = this.sendMessage.subscribe((message: Message) => {
            const messageRequestPacket = new MessageRequestPacket();
            messageRequestPacket.senderUserName = message.senderUserName;
            messageRequestPacket.receiverUserName = message.receiverUserName;
            messageRequestPacket.message = message;
            this.webSocket.send(JSON.stringify(messageRequestPacket));
        });
    }
}
