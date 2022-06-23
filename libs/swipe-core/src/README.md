## Installation

```
npm install @ag/swipe-core --save
```

## Usage

```typescript
import { createSwipeSubscription, SwipeEvent } from '@ag/swipe-core';

const domElement: HTMLElement = document.querySelector('#swipe-element');

createSwipeSubscription({
  domElement,
  onSwipeEnd: (event: SwipeEvent) => {
    console.log(`SwipeEnd direction: ${event.direction} and distance: ${event.distance}`);
  },
});
```

## Unsubscribing 
When swipe events should no longer be tracked:

```typescript
if (typeof swipeSubscription?.unsubscribe === 'function') {
  swipeSubscription.unsubscribe();
}
```
