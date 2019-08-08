import { Component, Input, OnInit, Renderer2, ViewChild, ElementRef, ViewContainerRef, EventEmitter, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/share/service/http.service';
import { Message, Result, MessageResponsePacket } from 'src/app/share/template/pojo';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME, CHAT_REMIND, TODAY, MESSAGE_PENDING, MESSAGE_SUCCEED } from 'src/app/share/template/constant';
import { Subscription } from 'rxjs';
import { v1 as uuid } from 'uuid';

@Component({
    selector: 'chat-interface',
    template: `
        <div style="height:70%; overflow-y: auto; overflow-x: hidden; padding-top: 20px; padding-bottom: 20px;" #chatContainer>
            <p-progressSpinner #processSpinner hidden [style]="{width: '50px', height: '50px'}"></p-progressSpinner>
            <!--
            <div><div class="friend-message"><span class="friend-message-title">Huchen</span><br/><span>Hello,Allen</span></div></div>
            <div><div class="owner-message"><span class="owner-message-title">Allen</span><br/><span>Hello,MyFriend</span></div></div>
            -->
        </div>
        <div style="height:30%; border-top: 1px solid darkgrey;">
            <chat-input (sendMessage)="showNoActualSendMessage($event)"></chat-input>
        </div>
    `,
    styles: [`
        .chat-remind {
            border-radius: 1em;
            background-color: lightgray;
            padding: 10px;
            margin: 0 auto;
            display: block;
            width: fit-content;
            font-size: 0.7em;
        }

        .owner-message {
            float: right;
            padding: 10px;
            background-color: yellowgreen;
            margin-right: 20px;
            border-radius: 0.5em;
            width: fit-content;
            max-width: 80%;
        }

        .owner-message-title {
            font-size:5px;
            color: darkcyan;
            cursor:pointer;
        }

        .friend-message {
            padding: 10px;
            background-color: lightgray;
            margin-left: 20px;
            border-radius: 0.5em;
            width: fit-content;
            max-width: 80%;
        }

        .friend-message-title {
            font-size:5px;
            color: darkgray;
            cursor:pointer;
        }

        .friend-message-title:hover,.owner-message-title:hover{
            color: black;
        }
    `]
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
    @Input()
    selectedFriendName: string;

    @Input()
    sendMessageListener: EventEmitter<Message>;

    @Input()
    getMessageListener: EventEmitter<Message>;
    getMessageSubscription: Subscription;

    @Input()
    getMessageResponseListener: EventEmitter<MessageResponsePacket>;
    getMessageRespSubscription: Subscription;

    @ViewChild('chatContainer')
    chatContainer: ElementRef;
    @ViewChild('processSpinner', { read: ViewContainerRef })
    processSpinner: ViewContainerRef;

    userName: string;
    beforeUser: string;
    messageIdToDomMap = new Map<string, { divContainer: any; spinner: any }>();

    constructor(private httpService: HttpService, private cookieService: CookieService, private renderer: Renderer2) {
        this.userName = this.cookieService.get(USER_NAME);
    }

    ngOnInit() {
        this.getMessageHandler();
        this.getMessageRespHandler();
        this.queryRecord();
    }

    ngOnDestroy() {
        if (this.getMessageSubscription) {
            this.getMessageSubscription.unsubscribe();
        }
        if (this.getMessageRespSubscription) {
            this.getMessageRespSubscription.unsubscribe();
        }
    }

    async queryRecord() {
        const result: Result<Message[]> = await this.httpService.queryChatRecord(this.userName, this.selectedFriendName);
        // field createDate need to render later
        const messages = result.value;
        // ----------test----------------
        // messages = this.addValueForTest();
        // ----------test----------------
        if (messages.length > 0) {
            this.showMessages(messages);
        } else {
            this.showChatRemind();
        }
    }

    public showNoActualSendMessage(noAcutalSendMessage: string) {
        const messageID = uuid();
        const message: Message = {
            messageId: messageID,
            fromUserName: this.userName,
            toFriendName: this.selectedFriendName,
            content: noAcutalSendMessage,
            messageStatus: MESSAGE_PENDING
        };
        this.showOneMessage(message.messageId, message.content, message.fromUserName, new Date().toString(), message.messageStatus);

        this.sendMessageListener.emit(message);
    }

    private getMessageHandler() {
        this.getMessageSubscription = this.getMessageListener.subscribe((message: Message) => {
            this.showOneMessage(message.messageId, message.content, message.fromUserName, message.createDate, message.messageStatus);
        });
    }

    private getMessageRespHandler() {
        this.getMessageRespSubscription = this.getMessageResponseListener.subscribe((response: MessageResponsePacket) => {
            const messageId = response.messageId;
            const container = this.messageIdToDomMap.get(messageId);
            const divContainer = container.divContainer;
            const spinner = container.spinner;
            if (container && divContainer && spinner) {
                this.renderer.removeChild(divContainer, spinner);
                this.messageIdToDomMap.delete(messageId);
            }
        });
    }

    private showChatRemind() {
        const chatRemindDiv = this.renderer.createElement('div');
        const chatRemindSpan = this.renderer.createElement('span');
        this.renderer.addClass(chatRemindSpan, 'chat-remind');
        this.renderer.appendChild(chatRemindSpan, this.renderer.createText(CHAT_REMIND));
        this.renderer.appendChild(chatRemindDiv, chatRemindSpan);
        this.renderer.appendChild(this.chatContainer.nativeElement, chatRemindDiv);
    }

    private showMessages(messages: Message[]) {
        messages.forEach(message => {
            this.showOneMessage(message.messageId, message.content, message.fromUserName, message.createDate, message.messageStatus);
        });
    }

    // smaple :
    //    <div><div class="friend-message"><span class="friend-message-title">Huchen</span><br/><span>Hello,Allen</span></div></div>
    //    <div><div class="owner-message"><span class="owner-message-title">Allen</span><br/><span>Hello,MyFriend</span></div></div>
    private showOneMessage(messageId: string, message: string, messageOwner: string, createDate: string, messageStatus: number) {
        const messageDivContainer = this.renderer.createElement('div');
        // this.renderer.setAttribute(messageDivContainer, 'messageId', messageId);
        const messageDiv = this.renderer.createElement('div');
        const messageTitleSpan = this.renderer.createElement('span');
        this.renderer.appendChild(messageTitleSpan, this.renderer.createText(messageOwner + '  '));
        this.renderer.appendChild(messageTitleSpan, this.renderer.createText(this.renderTime(createDate)));
        if (messageOwner === this.userName) {
            this.renderer.addClass(messageDiv, 'owner-message');
            this.renderer.addClass(messageTitleSpan, 'owner-message-title');
        } else {
            this.renderer.addClass(messageDiv, 'friend-message');
            this.renderer.addClass(messageTitleSpan, 'friend-message-title');
        }
        if (this.beforeUser) {
            if (this.beforeUser !== messageOwner) {
                // this.renderer.setStyle(messageDivContainer, 'margin-top', '10px');
            } else {
                this.renderer.setStyle(messageDivContainer, 'margin-top', '5px');
            }
        }
        this.beforeUser = messageOwner;
        this.renderer.appendChild(messageDiv, messageTitleSpan);
        this.renderer.appendChild(messageDiv, this.renderer.createElement('br'));
        const messageSpan = this.renderer.createElement('span');
        this.renderer.appendChild(messageSpan, this.renderer.createText(message));
        this.renderer.setStyle(messageSpan, 'word-break', 'break-all');
        this.renderer.appendChild(messageDiv, messageSpan);
        this.renderer.appendChild(messageDivContainer, messageDiv);
        this.renderer.appendChild(this.chatContainer.nativeElement, messageDivContainer);

        if (messageOwner === this.userName) {
            // 在实际生成前height为0，所以需要生成后获取高度重新生成一次
            const height = messageDiv.clientHeight;
            this.renderer.removeChild(this.chatContainer.nativeElement, messageDivContainer);
            this.renderer.setStyle(messageDivContainer, 'height', height + 'px');

            if (messageStatus === MESSAGE_PENDING) {
                // 2019-7-19 不知道如何动态生成一个processSpinner的ViewContainerRef,暂时先使用这种笨办法
                const clonePSpinner = this.processSpinner.element.nativeElement.cloneNode(true);
                this.renderer.removeAttribute(clonePSpinner, 'hidden');
                this.renderer.setStyle(clonePSpinner, 'float', 'right');
                // cloneSpinner的height设置为50的时候实际高度是56
                this.renderer.setStyle(clonePSpinner, 'padding-top', (height - 56) / 2 + 'px');
                this.renderer.appendChild(messageDivContainer, clonePSpinner);
                this.messageIdToDomMap.set(messageId, { divContainer: messageDivContainer, spinner: clonePSpinner });
            }
            this.renderer.appendChild(this.chatContainer.nativeElement, messageDivContainer);
        }

        this.chatContainer.nativeElement.scroll(0, this.chatContainer.nativeElement.scrollHeight);
    }

    private renderTime(createDate: string): string {
        const createTime = new Date(createDate);
        const now = new Date();
        if (createTime.toLocaleDateString() === now.toLocaleDateString()) {
            return TODAY + ' ' + createTime.toLocaleTimeString();
        } else {
            return createTime.toLocaleString();
        }
    }

    private addValueForTest(): Message[] {
        const messages: Message[] = [];
        this.selectedFriendName = 'Huchen';
        messages.push({
            messageId: '1',
            fromUserName: this.selectedFriendName,
            toFriendName: this.userName,
            content: 'Hello,Allen',
            messageStatus: MESSAGE_SUCCEED,
            createDate: '2019/7/17 15:58'
        });
        messages.push({
            messageId: '2',
            fromUserName: this.userName,
            toFriendName: this.selectedFriendName,
            content: 'Hello,MyFriend',
            messageStatus: MESSAGE_SUCCEED,
            createDate: '2019/7/17 15:58'
        });
        messages.push({
            messageId: '3',
            fromUserName: this.selectedFriendName,
            toFriendName: this.userName,
            content: 'Where are you?',
            messageStatus: MESSAGE_SUCCEED,
            createDate: '2019/7/17 15:59'
        });
        messages.push({
            messageId: '4',
            fromUserName: this.userName,
            toFriendName: this.selectedFriendName,
            content: 'Company is my house!',
            messageStatus: MESSAGE_SUCCEED,
            createDate: '2019/7/17 15:59'
        });
        messages.push({
            messageId: '6',
            fromUserName: this.userName,
            toFriendName: this.selectedFriendName,
            content: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊' +
                '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
            messageStatus: MESSAGE_PENDING,
            createDate: '2019/7/17 15:59'
        });
        return messages;
    }
}
