import { Component, OnInit } from '@angular/core';
import { Friend, Result } from 'src/app/share/template/pojo';
import { HttpService } from 'src/app/share/service/http.service';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME } from 'src/app/share/template/constant';

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
        }

        .friend-label:hover{
            background-color: gray !important;
        }

        .friend-label:last-child{
            border-bottom: 1px solid darkgrey;
        }
    `]
})
export class FriendLabelComponent implements OnInit {
    public friends: Friend[] = [];
    public choosed = new Map<string, boolean>();
    private nowChoosed: Friend;
    private userName: string;

    constructor(private httpService: HttpService, private cookieService: CookieService) {
        this.userName = this.cookieService.get(USER_NAME);
    }

    async ngOnInit() {
        const result: Result<Friend[]> = await this.httpService.getFriends(this.userName);
        this.friends = result.value;

        this.friends.forEach(item => {
            this.choosed.set(item.friendName, false);
        });
    }

    public click(friend: Friend) {
        if (this.nowChoosed) {
            if (this.nowChoosed === friend) {
                return;
            }
            this.choosed[this.nowChoosed.friendName] = false;
        }
        this.choosed[friend.friendName] = true;
        this.nowChoosed = friend;
    }
}
