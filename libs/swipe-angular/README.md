## Installation

```
npm install ng-swipe --save
```

## Usage

```typescript
import { SwipeModule } from 'ng-swipe';

@NgModule({
  imports: [
    SwipeModule
  ],
})
```

```typescript
import { SwipeEvent } from 'ng-swipe';

@Component({
  selector: 'app',
  template: `
    <div 
      ngSwipe 
      (swipeMove)="onSwipeMove($event)" 
      (swipeEnd)="onSwipeEnd($event)"
    >Swipe me!</div>
  `
})
export class AppComponent {
  onSwipeMove(event: SwipeEvent) {
    console.log(`SwipeMove direction: ${event.direction} and distance: ${event.distance}`);
  }
  onSwipeEnd(event: SwipeEvent) {
    console.log(`SwipeEnd direction: ${event.direction} and distance: ${event.distance}`);
  }
}
```
