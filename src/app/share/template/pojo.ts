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
    messageId: string;
    formUserName: string;
    toFriendName: string;
    content: string;
    createDate: string;
}
