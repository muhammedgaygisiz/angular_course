import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../user.model';

import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email,
                    password,
                    returnSecureToken: true,
                })
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    this.handleAuthentication(
                        response.email,
                        response.localId,
                        response.idToken,
                        +response.expiresIn
                    );
                })
            );
    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number) {

        const expirationDate
            = new Date(new Date().getTime() + expiresIn * 1000);

        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );

        this.store.dispatch(new AuthActions.AuthenticateSuccess({
            email,
            userId,
            token,
            expirationDate,
        }));

        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email,
                    password,
                    returnSecureToken: true,
                })
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    this.handleAuthentication(
                        response.email,
                        response.localId,
                        response.idToken,
                        +response.expiresIn
                    );
                })
            );
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errorMessage = 'Could not log in.';
                break;
        }

        return throwError(errorMessage);
    }

    logout() {
        this.store.dispatch(new AuthActions.Logout());
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.store.dispatch(new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
            }));
            const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() -
                new Date().getTime();

            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirtationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirtationDuration);
    }
}
