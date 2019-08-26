import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Result, FriendRelationship, CommentRelationship } from 'src/app/share/template/pojo';
import { HttpService } from 'src/app/share/service/http.service';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME } from 'src/app/share/template/constant';
import { ShareService } from 'src/app/share/service/share.service';

@Component({
    selector: 'comment-label',
    templateUrl: './commentLabel.component.html',
    styles: [`
        .friend-label-container{
            flex-flow: column wrap;
            overflow-y: auto;
            height: 100%;
            padding: 0px;
            background-color:gainsboro;
        }

        label{
            margin-left: 10px;
            margin-top: 10px;
            font-size: 20px;
        }

        .friend-label{
            height: 80px;
            border-top: 1px solid darkgrey;
            cursor: pointer;
        }

        .friend-label:hover{
            background-color: gray !important;
        }

        .friend-label:last-child{
            border-bottom: 1px solid darkgrey;
        }

        .no-comments{
            margin-top: 283px;
            display: block;
            font-size: 20px;
        }
    `]
})
export class CommentLabelComponent implements OnInit {
    @Input() oldSelectedComment: string;
    public friends: CommentRelationship[] = [];
    public choosed = new Map<string, boolean>();
    private nowChoosed: CommentRelationship;
    private userName: string;
    @Output()
    public selectedComment = new EventEmitter<string>();

    constructor(private httpService: HttpService, private cookieService: CookieService, private shareService: ShareService) {
        this.userName = this.cookieService.get(USER_NAME);
    }

    async ngOnInit() {
        const result: Result<FriendRelationship[]> = await this.httpService.getFriendRelationships(this.userName);
        this.friends = result.value.filter(item => {
            if (!this.shareService.isEmpty(this.oldSelectedComment) &&
                (item.relationshipId.receiverName === this.oldSelectedComment
                    || item.relationshipId.senderName === this.oldSelectedComment)) {
                item.hasComment = true;
                this.nowChoosed = {
                    friendName: item.relationshipId.receiverName === this.userName ?
                        item.relationshipId.senderName : item.relationshipId.receiverName,
                    ownerName: this.userName,
                    hasComment: item.hasComment,
                    lastMessageId: item.lastMessageId
                };
            }
            return item.hasComment;
        }).map(item => {
            return {
                friendName: item.relationshipId.receiverName === this.userName ?
                    item.relationshipId.senderName : item.relationshipId.receiverName,
                ownerName: this.userName,
                hasComment: item.hasComment,
                lastMessageId: item.lastMessageId
            };
        });

        this.friends.forEach(item => {
            if (!this.shareService.isEmpty(this.oldSelectedComment) && item.friendName === this.oldSelectedComment) {
                this.choosed.set(item.friendName, true);
            } else {
                this.choosed.set(item.friendName, false);
            }
        });
    }

    public click(friend: CommentRelationship) {
        if (this.nowChoosed) {
            if (this.nowChoosed === friend) {
                return;
            }
            this.choosed.set(this.nowChoosed.friendName, false);
        }
        this.choosed.set(friend.friendName, true);
        this.nowChoosed = friend;
        this.selectedComment.emit(friend.friendName);
    }
}
