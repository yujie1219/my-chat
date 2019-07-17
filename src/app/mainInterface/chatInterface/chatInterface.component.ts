import { Component, Input, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/share/service/http.service';
import { Message, Result } from 'src/app/share/template/pojo';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME } from 'src/app/share/template/constant';

@Component({
    selector: 'chat-interface',
    template: `
        <div style="height:70%; overflow-y: auto; padding-top: 20px; padding-bottom: 20px;" #chatContainer>
        <!--
            <div><div class="friend-message"><span class="friend-message-title">Huchen</span><br/><span>Hello,Allen</span></div></div>
            <div><div class="owner-message"><span class="owner-message-title">Allen</span><br/><span>Hello,MyFriend</span></div></div>
            -->
        </div>
        <div style="height:30%; background-color:black"></div>
    `,
    styles: [`
        .owner-message {
            float: right;
            padding: 10px;
            background-color: yellowgreen;
            margin-right: 20px;
            margin-bottom: 5px;
            border-radius: 0.5em;
            width: fit-content;
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
            margin-bottom: 5px;
            border-radius: 0.5em;
            width: fit-content;
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
export class ChatInterfaceComponent implements OnInit {
    @Input()
    selectedFriendName: string;
    @ViewChild('chatContainer')
    chatContainer: ElementRef;
    userName: string;

    constructor(private httpService: HttpService, private cookieService: CookieService, private renderer: Renderer2) {
        this.userName = this.cookieService.get(USER_NAME);
    }

    ngOnInit() {
        this.queryRecord();
    }

    async queryRecord() {
        const result: Result<Message[]> = await this.httpService.queryChatRecord(this.userName, this.selectedFriendName);
        let messages = result.value;
        // ----------test----------------
        messages = this.addValueForTest();
        // ----------test----------------
        // smaple :
        //    <div><div class="friend-message"><span class="friend-message-title">Huchen</span><br/><span>Hello,Allen</span></div></div>
        //    <div><div class="owner-message"><span class="owner-message-title">Allen</span><br/><span>Hello,MyFriend</span></div></div>
        messages.forEach(message => {
            const messageDivContainer = this.renderer.createElement('div');
            const messageDiv = this.renderer.createElement('div');
            const messageTitleSpan = this.renderer.createElement('span');
            this.renderer.appendChild(messageTitleSpan, this.renderer.createText(message.fromUserName));
            if (message.fromUserName === this.userName) {
                this.renderer.addClass(messageDiv, 'owner-message');
                this.renderer.addClass(messageTitleSpan, 'owner-message-title');
            } else {
                this.renderer.addClass(messageDiv, 'friend-message');
                this.renderer.addClass(messageTitleSpan, 'friend-message-title');
            }
            this.renderer.appendChild(messageDiv, messageTitleSpan);
            this.renderer.appendChild(messageDiv, this.renderer.createElement('br'));
            const messageSpan = this.renderer.createElement('span');
            this.renderer.appendChild(messageSpan, this.renderer.createText(message.content));
            this.renderer.appendChild(messageDiv, messageSpan);
            this.renderer.appendChild(messageDivContainer, messageDiv);
            this.renderer.appendChild(this.chatContainer.nativeElement, messageDivContainer);

            if (message.fromUserName === this.userName) {
                console.log(messageDiv.clientHeight);
                const height = messageDiv.clientHeight;
                this.renderer.removeChild(this.chatContainer.nativeElement, messageDivContainer);
                this.renderer.setStyle(messageDivContainer, 'height', height + 'px');
                this.renderer.appendChild(this.chatContainer.nativeElement, messageDivContainer);
            }
        });
    }

    private addValueForTest(): Message[] {
        const messages: Message[] = [];
        this.selectedFriendName = 'Huchen';
        messages.push({
            messageId: '1',
            fromUserName: this.selectedFriendName,
            toFriendName: this.userName,
            content: 'Hello,Allen',
            createDate: '2019/7/17 15:58'
        });
        messages.push({
            messageId: '2',
            fromUserName: this.userName,
            toFriendName: this.selectedFriendName,
            content: 'Hello,MyFriend',
            createDate: '2019/7/17 15:58'
        });
        messages.push({
            messageId: '1',
            fromUserName: this.selectedFriendName,
            toFriendName: this.userName,
            content: 'Where are you?',
            createDate: '2019/7/17 15:59'
        });
        messages.push({
            messageId: '2',
            fromUserName: this.userName,
            toFriendName: this.selectedFriendName,
            content: 'Company is my house!',
            createDate: '2019/7/17 15:59'
        });
        return messages;
    }
}
