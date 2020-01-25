import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './recipe.model';
import { Observable } from 'rxjs/internal/Observable';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStorageService: DataStorageService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot)
        : Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        return this.dataStorageService.fetchRecipes();
    }

}
