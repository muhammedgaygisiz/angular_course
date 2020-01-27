import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';

export class AuthEffects {
    authLogin = this.actions$
        .pipe(
            ofType()
        );

    constructor(
        private actions$: Actions
    ) {}


}
