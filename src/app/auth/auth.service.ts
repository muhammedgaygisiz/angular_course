import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';

import { User } from '../user.model';
import { Router } from '@angular/router';

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
    private webApiKey = '...';

    user = new BehaviorSubject<User>(null);

    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.webApiKey,
            {
                email,
                password,
                returnSecureToken: true,
            }
        )
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

        const user
            = new User(
                email,
                userId,
                token,
                expirationDate
            );

        this.user.next(user);
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.webApiKey,
            {
                email,
                password,
                returnSecureToken: true,
            }
        )
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
        this.user.next(null);
        this.router.navigate(['/auth']);
    }
}
