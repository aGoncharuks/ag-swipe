# Angular Swipe

## Installation

```
npm install ng-swipe --save
```

## Usage

Import SwipeModule to your module:

```typescript
import { SwipeModule } from 'ng-swipe';

@NgModule({
  imports: [
    SwipeModule
  ],
})
```

Add `ngSwipe` directive to your DOM element and listen to `swipeMove` or `swipeEnd` events that are emitted when 
swipe happens on this element.

```typescript
import { SwipeEvent } from 'ng-swipe';

@Component({
  selector: 'app',
  template: `
    <div 
      ngSwipe 
      (swipeMove)="onSwipeMove($event)" 
      (swipeMove)="onSwipeEnd($event)"
    >My test element for swipe</div>
  `
})
export class AppComponent {
  onSwipeMove(event: SwipeEvent) {
    console.log(`swipe direction: ${event.direction}`);
    console.log(`swipe distance: ${event.distance}`);
  }
  onSwipeEnd(event: SwipeEvent) {
    console.log(`swipe direction: ${event.direction}`);
    console.log(`swipe distance: ${event.distance}`);
  }  
}
```
