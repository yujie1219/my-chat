import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'chat-input',
    templateUrl: './chatInput.component.html',
    styleUrls: ['./chatInput.component.css']
})
export class ChatInputComponent {
    public newMessage = '';
    // tslint:disable-next-line:no-output-rename
    @Output('sendMessage') sendMessageBroadCast = new EventEmitter<string>();

    public textEnter($event) {
        if ($event.keyCode === 13) {
            $event.preventDefault();
            this.sendMessage();
        } else if ($event.keyCode === 10) {
            this.newMessage += '\n';
        }
    }

    public sendMessage() {
        const newMessage = this.newMessage.trim();
        if (newMessage.length > 0) {
            this.sendMessageBroadCast.emit(newMessage);
            // send to server by websocket

            this.newMessage = '';
        }
    }
}
