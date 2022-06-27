This library is a React hook wrapper around the vanilla JS swipe detection library `ag-swipe-core`.

For more details on the public interface of the library please see the [Github page](https://github.com/aGoncharuks/ag-swipe).

## Installation

```
npm install ag-swipe-react --save
```

## Usage

```tsx
import { SwipeEvent, useSwipe } from 'ag-swipe-react';

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
