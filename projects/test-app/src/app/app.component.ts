import { Component } from '@angular/core';
import { SwipeEvent } from '../../../angular-swipe/src/lib/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  onSwipeEnd(event: SwipeEvent) {
    console.log(event);
  }
}
