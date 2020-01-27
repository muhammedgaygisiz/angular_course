import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

export interface AppState {
    shoppingList: State;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Oranges', 10),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1,
};

export function shoppingListReducer(
    state: State = initialState,
    action: ShoppingListActions.ShoppingListActions
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    action.payload
                ]
            };
            break;

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    ...action.payload
                ]
            };
            break;

        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.ingredient,
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients
            };
            break;

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, index) => {
                    return index !== action.payload;
                })
            };
            break;

        default:
            return state;
            break;
    }
}
