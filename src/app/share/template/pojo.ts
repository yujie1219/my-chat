import { FRIEND_REQUEST, FRIEND_RESPONSE } from './constant';

export interface Result<T> {
    statusCode: number;
    value?: T;
    errorMessage?: string;
}

export interface Token {
    refreshToken: string;
    createTime: string;
    accessToken: string;
    userName: string;
}

export interface User {
    userName: string;
    password: string;
}

export interface Friend {
    friendName: string;
    ownerName: string;
    verifyMess?: string;
    lastMessage?: Message;
    hasComment?: boolean;
    messages?: Message[];
}

export interface Message {
    messageId?: string;
    fromUserName: string;
    toFriendName: string;
    content: string;
    createDate?: string;
}

export class FriendRequestPacket {
    private version = 1;
    private command = FRIEND_REQUEST;
    fromUserName: string;
    verifyMess?: string;

    public getCommand() {
        return this.command;
    }
}

export class FriendReponsePacket {
    private version = 1;
    private command = FRIEND_RESPONSE;
    fromUserName: string;
    toUserName: string;
    approved: boolean;
    responseMessage?: string;

    public getCommand() {
        return this.command;
    }
}
