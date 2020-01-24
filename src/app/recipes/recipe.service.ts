import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        new Recipe(
            'Schnitzel',
            'This is simply a test',
            'assets/images/dummy.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20),
            ]
        ),
        new Recipe(
            'Burger',
            'This is simply a test',
            'assets/images/dummy.jpg',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ]
        )];

    constructor(private slService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }
    
    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }
}
