import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import { ServersComponent } from './servers/servers.component';
import { AppWarningAlertComponent } from './warning-alert/warning-alert.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    ServersComponent,
    AppWarningAlertComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
