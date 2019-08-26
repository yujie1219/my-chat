import { FRIEND_REQUEST, FRIEND_RESPONSE, MESSAGE_REQUEST, MESSAGE_RESPONSE } from './constant';

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
    password?: string;
    registerDate?: string;
    lastLogin?: string;
    customInfo?: string;
}

export interface FriendRelationship {
    relationshipId: FriendRelationshipKey;
    hasComment: boolean;
    lastMessageId?: string;
}

export interface CommentRelationship {
    friendName: string;
    ownerName: string;
    hasComment: boolean;
    lastMessageId?: string;
}

export interface FriendRelationshipKey {
    senderName: string;
    receiverName: string;
}

export interface Message {
    messageId: string;
    senderUserName: string;
    content: string;
    receiverUserName: string;
    messageStatus: number;
    createDate?: string;
}

export class FriendRequestPacket {
    private version = 1;
    private command = FRIEND_REQUEST;
    senderUserName: string;
    receiverUserName: string;
    verifyMess?: string;

    public getCommand() {
        return this.command;
    }
}

export class FriendReponsePacket {
    private version = 1;
    private command = FRIEND_RESPONSE;
    senderUserName: string;
    receiverUserName: string;
    approved: boolean;
    responseMessage?: string;

    public getCommand() {
        return this.command;
    }
}

export class MessageRequestPacket {
    private version = 1;
    private command = MESSAGE_REQUEST;
    senderUserName: string;
    receiverUserName: string;
    message: Message;

    public getCommand() {
        return this.command;
    }
}

export class MessageResponsePacket {
    private version = 1;
    private command = MESSAGE_RESPONSE;
    messageId: string;
    sendSucceed: boolean;
    successTime: string;
    failureReason: string;

    public getCommand() {
        return this.command;
    }
}
