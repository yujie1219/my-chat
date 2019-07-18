import { Component } from '@angular/core';

@Component({
    selector: 'chat-input',
    templateUrl: './chatInput.component.html',
    styleUrls: ['./chatInput.component.css']
})
export class ChatInputComponent {
    public newMessage = '';

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

            // send to server by websocket

            this.newMessage = '';
        }
    }
}
