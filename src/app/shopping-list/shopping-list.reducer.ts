import { Ingredient } from '../shared/ingredient.model';


const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Oranges', 10),
    ]
};

export function shoppingListReducer(state = initialState, action) {
    
}
