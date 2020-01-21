import { Recipe } from './recipe.model';

export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe(
            'A Test Recipe',
            'This is simply a test',
            'assets/images/dummy.jpg'
        ),
        new Recipe(
            'Another Test Recipe',
            'This is simply a test',
            'assets/images/dummy.jpg'
        )];

    getRecipe() {
        return this.recipes.slice();
    }
}