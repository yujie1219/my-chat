import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Result } from '../template/pojo';
import { Token } from '@angular/compiler';

@Injectable()
export class HttpService {
    private bathUrl = 'http://127.0.0.1:8081';

    constructor(private http: HttpClient) {

    }

    public loginApi(user: User): Promise<Result<Token>> {
        return this.http.post<Result<Token>>(this.bathUrl + '/user/login', user).toPromise();
    }

    public registerApi(user: User): Promise<Result<Token>> {
        return this.http.post<Result<Token>>(this.bathUrl + '/user/register', user).toPromise();
    }
}
