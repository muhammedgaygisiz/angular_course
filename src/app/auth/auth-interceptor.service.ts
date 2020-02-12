import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpEvent, HttpEventType } from '@angular/common/http';

import { AuthService } from './auth.service';
import { exhaustMap, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private store: Store<fromApp.AppState>
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => {
                if (!user) {
                    const nextHandler = next.handle(req);

                    nextHandler.subscribe((event: HttpEvent<any>) => {
                        if(event.type === HttpEventType.Response) {
                            console.log("access-control-allow-origin", event.headers.get("access-control-allow-origin"));
                            console.log("x-content-type-options", event.headers.get("x-content-type-options"));
                            console.log("content-encoding", event.headers.get("content-encoding"));
                        }
                    })

                    return nextHandler;
                }

                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });


                return next.handle(modifiedReq);
            })
        );
    }
}
