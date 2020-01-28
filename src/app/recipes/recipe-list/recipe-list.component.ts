import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [
    trigger('buttonState', [
      state('normal', style({})),
      state('activated', style({
        backgroundColor: '#337ab7',
        borderColor: '#2e6da4'
      })),
      transition('normal => activated', animate(300)),
      transition('activated => normal', animate(300))
    ])
  ]
})
export class RecipeListComponent implements OnInit, OnDestroy {
  state = 'normal';
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) { }

  ngOnInit() {
    this.subscription = this.store.select('recipes')
      .pipe(
        map(recipesState => recipesState.recipes)
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
  }

  onNewRecipe() {
    this.state === 'normal' ? this.state = 'activated' : this.state = 'normal';
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
