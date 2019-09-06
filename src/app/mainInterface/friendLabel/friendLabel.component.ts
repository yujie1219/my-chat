import { Component, Output, EventEmitter, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/share/service/http.service';
import { Result, FriendReponsePacket, UserAccount } from 'src/app/share/template/pojo';
import { CookieService } from 'ngx-cookie-service';
import { USER_NAME, NEW_FRIEND } from 'src/app/share/template/constant';
import { ShareService } from 'src/app/share/service/share.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'friend-label',
    templateUrl: './friendLabel.component.html',
    styles: [`
        .friend-label-container{
            flex-flow: column wrap;
            overflow-y: auto;
            height: 100%;
            padding: 0px;
            background-color:gainsboro;
        }

        .friend-label{
            height: 80px;
            cursor: pointer;
        }

        .friend-label:hover{
            background-color: gray !important;
        }

        .friend-categray{
            border-bottom: 1px solid darkgrey;
            width: 100%;
            font-size: 12px;
            padding: 5px;
            color: darkgray;
        }

        img{
            height: 75px;
            padding: 5px
        }

        .friend-name{
            font-size: 18px;
            padding-left: 5px;
            cursor: pointer;
        }
    `]
})
export class FriendLabelComponent implements OnInit, OnDestroy {
    @Input() oldSelectedFriend: string;
    @Input()
    public friendAdded: EventEmitter<FriendReponsePacket>;
    @Output()
    public selectedFriend = new EventEmitter<string>();
    @Output()
    public selectedComment = new EventEmitter<string>();
    public firstletters: string[] = [];
    public fl2FriendMap = new Map<string, UserAccount[]>();
    public choosed = new Map<string, boolean>();
    private nowChoosed: UserAccount;
    private userName = this.cookieService.get(USER_NAME);
    private isSingleClick = true;
    private friendAddedSubscription: Subscription;

    constructor(private httpService: HttpService, private cookieService: CookieService, private shareService: ShareService) {

    }

    async ngOnInit() {
        this.friendAddedSubscription = this.friendAdded.subscribe((friendReponsePacket: FriendReponsePacket) => {
            if (friendReponsePacket.approved) {
                this.shareService.openErrorModal('添加好友' + friendReponsePacket.senderUserName + '成功', '对方同意了你的好友请求！');
                this.refreshFriends();
            } else {
                this.shareService.openErrorModal('添加好友' + friendReponsePacket.senderUserName + '失败', '对方拒绝了你的好友请求！');
            }
        });
        this.refreshFriends();
    }

    ngOnDestroy() {
        if (this.friendAddedSubscription) {
            this.friendAddedSubscription.unsubscribe();
        }
    }

    public clickFriend(friend: UserAccount) {
        this.isSingleClick = true;
        setTimeout(() => {
            if (this.isSingleClick) {
                this.selectFriend(friend);
            }
        }, 250);
    }

    public dblclickFriend(friend: UserAccount) {
        if (friend.userName !== NEW_FRIEND) {
            this.isSingleClick = false;
            this.selectedComment.emit(friend.userName);
        }
    }

    private selectFriend(friend: UserAccount) {
        if (!friend) {
            friend = {
                userName: NEW_FRIEND
            };
        }
        if (this.nowChoosed) {
            if (this.nowChoosed === friend) {
                return;
            }
            this.choosed.set(this.nowChoosed.userName, false);
        }
        this.choosed.set(friend.userName, true);
        this.nowChoosed = friend;
        this.oldSelectedFriend = friend.userName;
        this.selectedFriend.emit(friend.userName);
    }

    private async refreshFriends() {
        this.initVariant();
        const result: Result<UserAccount[]> = await this.httpService.getFriends(this.userName);
        this.addNewFriendRef();

        const sortResult = result.value.sort((a, b) => {
            const aName = a.userName.split('');
            const bName = b.userName.split('');
            for (let i = 0; ; i++) {
                if (aName[i] > bName[i]) {
                    return 1;
                } else if (aName[i] === bName[i]) {
                    if (!aName[i + 1] && !bName[i + 1]) {
                        return 0;
                    } else {
                        if (!aName[i + 1]) {
                            return -1;
                        }
                        if (!bName[i + 1]) {
                            return 1;
                        }
                    }
                } else {
                    return -1;
                }
            }
        });
        sortResult.forEach(item => {
            this.choosed.set(item.userName, false);
            const firstLetter = item.userName.substring(0, 1);
            if (!this.firstletters.includes(firstLetter)) {
                this.firstletters.push(firstLetter);
            }

            const existArr = this.fl2FriendMap.get(firstLetter);
            if (existArr) {
                existArr.push(item);
                this.fl2FriendMap.set(firstLetter, existArr);
            } else {
                this.fl2FriendMap.set(firstLetter, [item]);
            }
        });
        if (this.oldSelectedFriend && this.choosed.get(this.oldSelectedFriend) !== undefined) {
            this.selectFriend({
                userName: this.oldSelectedFriend
            });
        }
    }

    private initVariant() {
        this.firstletters = [];
        this.fl2FriendMap.clear();
        this.choosed.clear();
        this.nowChoosed = null;
    }

    private addNewFriendRef() {
        const newFriend: UserAccount = {
            userName: NEW_FRIEND
        };
        this.choosed.set(NEW_FRIEND, false);
        this.firstletters.push(NEW_FRIEND);
        this.fl2FriendMap.set(NEW_FRIEND, [newFriend]);
    }
}
