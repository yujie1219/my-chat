import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Result, Token, Message, FriendRelationship } from '../template/pojo';

@Injectable()
export class HttpService {
    private baseUrl = 'http://127.0.0.1:8081';

    constructor(private http: HttpClient) {

    }

    public loginApi(user: User): Promise<Result<Token>> {
        return this.http.post<Result<Token>>(this.baseUrl + '/user/login', user).toPromise();
    }

    public registerApi(user: User): Promise<Result<Token>> {
        return this.http.post<Result<Token>>(this.baseUrl + '/user/register', user).toPromise();
    }

    public getAccessToken(userName: string, refreshToken: string): Promise<Result<Token>> {
        const option = {
            params: {
                userName,
                refreshToken
            }
        };
        return this.http.get<Result<Token>>(this.baseUrl + '/auth/accessToken', option).toPromise();
    }

    public getFriends(userName: string): Promise<Result<User[]>> {
        const option = {
            params: {
                userName
            }
        };
        return this.http.get<Result<User[]>>(this.baseUrl + '/user/friends', option).toPromise();
    }

    public getFriendRelationships(userName: string): Promise<Result<FriendRelationship[]>> {
        const option = {
            params: {
                userName
            }
        };
        return this.http.get<Result<FriendRelationship[]>>(this.baseUrl + '/user/friendRelationships', option).toPromise();
    }

    public queryChatRecord(userName: string, friendName: string): Promise<Result<Message[]>> {
        const option = {
            params: {
                ownerName: userName,
                friendName
            }
        };
        return this.http.get<Result<Message[]>>(this.baseUrl + '/user/messages', option).toPromise();
    }
}
