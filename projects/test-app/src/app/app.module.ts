import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SwipeModule } from '../../../angular-swipe/src/lib/swipe.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SwipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
