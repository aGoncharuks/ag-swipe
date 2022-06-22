import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SwipeModule } from '@ag/swipe-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SwipeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
