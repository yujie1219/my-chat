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
    messages?: string[];
}
