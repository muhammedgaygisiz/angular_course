import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Recipe } from './recipe.model';
import * as RecipeActions from './store/recipes.actions';


@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions,
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot)
        : Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

        return this.store.select('recipes')
            .pipe(
                take(1),
                map(recipesState => recipesState.recipes),
                switchMap(recipes => {
                    if (recipes.length === 0) {
                        this.store.dispatch(new RecipeActions.FetchRecipes());

                        // Workaroung to wait till SET_RECIPES action is called
                        // to make sure recipes are loaded
                        return this.actions$.pipe(
                            ofType(RecipeActions.SET_RECIPES),
                            take(1)
                        );
                    } else {
                        return of(recipes);
                    }
                })
            );
    }

}
