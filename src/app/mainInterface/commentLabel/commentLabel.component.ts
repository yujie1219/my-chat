import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Friend, Result } from 'src/app/share/template/pojo';
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
    public friends: Friend[] = [];
    public choosed = new Map<string, boolean>();
    private nowChoosed: Friend;
    private userName: string;
    @Output()
    public selectedComment = new EventEmitter<string>();

    constructor(private httpService: HttpService, private cookieService: CookieService, private shareService: ShareService) {
        this.userName = this.cookieService.get(USER_NAME);
    }

    async ngOnInit() {
        const result: Result<Friend[]> = await this.httpService.getFriends(this.userName);
        this.friends = result.value.filter(item => {
            if (!this.shareService.isEmpty(this.oldSelectedComment) && item.friendName === this.oldSelectedComment) {
                item.hasComment = true;
                this.nowChoosed = item;
            }
            return item.hasComment;
        });

        this.friends.forEach(item => {
            if (!this.shareService.isEmpty(this.oldSelectedComment) && item.friendName === this.oldSelectedComment) {
                this.choosed.set(item.friendName, true);
            } else {
                this.choosed.set(item.friendName, false);
            }
        });
    }

    public click(friend: Friend) {
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
