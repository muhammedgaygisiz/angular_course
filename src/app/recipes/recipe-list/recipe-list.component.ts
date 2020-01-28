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
      transition('normal <=> activated', animate(300)),
    ]),
    trigger('wildState', [
      state('normal', style({})),
      state('activated', style({
        backgroundColor: '#337ab7',
        borderColor: '#2e6da4'
      })),
      state('shrunken', style({
        transform: 'translateX(0) scale(0.5)'
      })),
      transition('normal => activated', animate(300)),
      transition('activated => normal', animate(800)),
      transition('shrunken <=> *', [
        style({
          'background-color': 'orange'
        }),
        animate(100, style({
          borderRadius: '50px'
        })),
        animate(500)
      ]),
    ])
  ]
})
export class RecipeListComponent implements OnInit, OnDestroy {
  state = 'normal';
  wildState = 'normal';
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
    this.wildState === 'normal' ? this.wildState = 'activated' : this.wildState = 'normal';

    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onAnimate() {
    this.wildState === 'normal' ? this.wildState = 'shrunken' : this.wildState = 'normal';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
