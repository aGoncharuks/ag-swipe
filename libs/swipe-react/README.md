## Installation

```
npm install @ag/swipe-react --save
```

## Usage

```tsx
import { SwipeEvent, useSwipe } from '@ag/swipe-react';

export function App() {
  const swipeElement = useSwipe({
    onSwipeMove: (event: SwipeEvent) => {
      console.log(`SwipeMove direction: ${event.direction} and distance: ${event.distance}`);
    },
    onSwipeEnd: (event: SwipeEvent) => {
      console.log(`SwipeEnd direction: ${event.direction} and distance: ${event.distance}`);
    }
  });

  return <div ref={swipeElement}>Swipe me!</div>
}
```
