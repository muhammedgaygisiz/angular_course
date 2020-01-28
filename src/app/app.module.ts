import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './auth/store/auth.effects';
import { CoreModule } from './core.module';
import { HeaderComponent } from './header/header.component';
import { RecipeEffects } from './recipes/store/recipes.effects';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './store/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    EffectsModule.forRoot([
      AuthEffects,
      RecipeEffects,
    ]),
    StoreRouterConnectingModule.forRoot()
  ],
  bootstrap: [
    AppComponent
  ],
  // providers: [
  //   LoggingService
  // ]
})
export class AppModule { }
