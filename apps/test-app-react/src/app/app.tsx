import { SwipeEvent, useSwipe } from 'ag-swipe-react';

export function App() {
  const swipeElement = useSwipe({
    onSwipeEnd: (event: SwipeEvent) => {
      console.log(`SwipeEnd direction: ${event.direction} and distance: ${event.distance}`);
    }
  });

  return <div ref={swipeElement}>Swipe me!</div>
}

export default App;
