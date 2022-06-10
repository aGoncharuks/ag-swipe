# Angular Swipe

A lightweight Angular directive to detect swipes on touchscreen devices.

## Installation

```
npm install ng-swipe --save
```

## Usage

Import ``SwipeModule`` to your module:

```typescript
import { SwipeModule } from 'ng-swipe';

@NgModule({
  imports: [
    SwipeModule
  ],
})
```

Add ``ngSwipe`` directive to your DOM element and listen to ``swipeMove`` or ``swipeEnd`` events that are emitted when 
swipe happens on this element.<br/>
Both events correspond to ``SwipeEvent`` interface, which contains two fields:<br/>
``direction: 'y' | 'x'``  - defines swipe direction<br/>
``distance: number`` - defines swipe length in pixels

```typescript
import { SwipeEvent } from 'ng-swipe';

@Component({
  selector: 'app',
  template: `
    <div 
      ngSwipe 
      (swipeMove)="onSwipeMove($event)" 
      (swipeEnd)="onSwipeEnd($event)"
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

## Swipe direction
All four swipe directions(right, left, up, down) can be easily detected by filtering events by ``direction`` and 
``distance`` 
fields in 
consumer component e.g. right swipe will have ``direction === 'x'`` and ``distance > 0``.
