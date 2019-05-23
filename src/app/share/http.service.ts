import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {
    private bathUrl = 'http://127.0.0.1:8081';

    constructor(private http: HttpClient) {

    }

    public loginApi(userName: string, password: string) {
        return this.http.post<string>(this.bathUrl + '/user/login', {
            userName,
            password
        }).toPromise();
    }

    public registerApi(userName: string, password: string) {
        return this.http.post<string>(this.bathUrl + '/user/register', {
            userName,
            password
        }).toPromise();
    }
}
