import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InterceptorProvider {
    public baseUrl: string;

    constructor(private http: Http) {
        this.baseUrl = 'http://localhost:55787/';
    }

    // generic GET-request
    public get<T>(path: string, options?: RequestOptionsArgs) {
        const headers = new Headers();

        headers.append('Access-Control-Allow-Origin', 'true');

        // use options if passed, otherwhise use above headers instead
        options = options || { headers: headers };

        return this.http.get(this.baseUrl + path, options).map(res => {
            if (this.hasJsonHeader(res.headers)) {
                return res.json();
            }
            return res;
        });
    }

    // generic POST-request w/ token included in header
    public post<T>(path: string, body: string, options?: RequestOptionsArgs) {
        const headers = new Headers();

        headers.append('Access-Control-Allow-Origin', 'true');
        headers.append('Content-Type', 'application/json');

        // in-case of specific request; ignore headers and use parameter instead
        options = options || { headers: headers };

        return this.http.post(this.baseUrl + path, body, options).map(res => {
            if (this.hasJsonHeader(res.headers)) {
                return res.json();
            }
            return res;
        }).catch(error => { return this.throwError(error); });
    }

    // generic PUT-request w/ token included in header
    public put<T>(path: string, body: string, options?: RequestOptionsArgs) {
        const headers = new Headers();

        headers.append('Access-Control-Allow-Origin', 'true');
        headers.append('Content-Type', 'application/json');

        // if token exists, append it to authorization-header 
        if (localStorage.getItem('token') !== null) {
            headers.append('Authorization', 'Bearer ' +
                JSON.parse(localStorage.getItem('token')).accessToken);
        }

        // in-case of specific request; ignore headers and use parameter instead
        options = options || { headers: headers };

        return this.http.put(this.baseUrl + path, body, options).map(res => {
            if (this.hasJsonHeader(res.headers)) {
                return res.json();
            }
            return res;
        }).catch(error => { return this.throwError(error); });
    }

    // generic DELETE-request w/ token included in header
    public delete<T>(path: string, options?: RequestOptionsArgs) {
        const headers = new Headers();

        headers.append('Access-Control-Allow-Origin', 'true');
        headers.append('Content-Type', 'application/json');

        // in-case of specific request; ignore headers and use parameter instead
        options = options || { headers: headers };

        return this.http.delete(this.baseUrl + path, options).map(res => {
            if (this.hasJsonHeader(res.headers)) {
                return res.json();
            }
            return res;
        }).catch(error => { return this.throwError(error); });
    }

    private throwError(error: any) {
        const obj =  this.hasJsonHeader(error.headers) ? error.json() : error;
        const msg = obj.error_description || obj.Message || obj._body || 'Uncaught error';
        return Observable.throw(msg);
    }

    private hasJsonHeader(headers) {
        return (headers.has('content-type') && headers.get('content-type').search('application/json') !== -1)
            || (headers.has('Content-Type') && headers.get('Content-Type').search('application/json') !== -1);
    }
}
