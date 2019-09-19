import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ShareService } from 'src/app/share/service/share.service';
import { HttpService } from 'src/app/share/service/http.service';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME, REPLY_APPROVE, REPLY_REJECT } from 'src/app/share/template/constant';
import { FriendRequestPacket, Result, FriendRequest, FriendReponsePacket } from 'src/app/share/template/pojo';

@Component({
    selector: 'add-friend',
    templateUrl: './addFriend.component.html',
    styleUrls: ['./addFriend.component.css']
})
export class AddFriendComponent implements OnInit {
    @Output()
    sendAddFriendRequest = new EventEmitter<FriendRequestPacket>();
    @Input() isApprove: EventEmitter<FriendReponsePacket>;

    public addFriendForm: FormGroup = new FormGroup({
        userName: new FormControl('', this.shareService.isNullOrEmpty()),
        verifyMess: new FormControl('', this.shareService.verifyMessageLength())
    });
    public friendRequests: FriendRequest[] = [];
    private currentUserName = this.cookieService.get(USER_NAME);

    public get userName() {
        return this.addFriendForm.get('userName');
    }

    public get verifyMess() {
        return this.addFriendForm.get('verifyMess');
    }

    constructor(private shareService: ShareService, private httpSerivce: HttpService, private cookieService: CookieService) {

    }

    async ngOnInit() {
        const result: Result<FriendRequest[]> = await this.httpSerivce.getFriendRequests(this.currentUserName);
        this.friendRequests = result.value;
    }

    public focus(control: FormControl) {
        control.markAsUntouched();
    }

    public async addFriend() {
        const request: FriendRequestPacket = new FriendRequestPacket();
        request.senderUserName = this.currentUserName;
        request.receiverUserName = this.addFriendForm.get('userName').value;
        request.verifyMess = this.addFriendForm.get('verifyMess').value;
        const result: Result<boolean> = await this.httpSerivce.friendRequestVerification(request.receiverUserName, request.senderUserName);
        if (result.value) {
            this.sendAddFriendRequest.emit(request);
        } else {
            this.shareService.openErrorModal('添加好友失败！', result.errorMessage);
        }
    }

    public reset() {
        this.addFriendForm.reset();
    }

    public approve(request: FriendRequest) {
        const friendReponsePacket = new FriendReponsePacket();
        friendReponsePacket.requestId = request.friendRequestId;
        friendReponsePacket.senderUserName = this.currentUserName;
        friendReponsePacket.receiverUserName = request.senderUserName;
        friendReponsePacket.approved = true;
        this.isApprove.emit(friendReponsePacket);
        // after send the response , I should update the interface of the request
        request.requestStatus = REPLY_APPROVE;
    }

    public reject(request: FriendRequest) {
        const friendReponsePacket = new FriendReponsePacket();
        friendReponsePacket.requestId = request.friendRequestId;
        friendReponsePacket.senderUserName = this.currentUserName;
        friendReponsePacket.receiverUserName = request.senderUserName;
        friendReponsePacket.approved = false;
        this.isApprove.emit(friendReponsePacket);
        // after send the response , I should update the interface of the request
        request.requestStatus = REPLY_REJECT;
    }
}
