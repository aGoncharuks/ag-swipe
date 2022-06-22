import { useSwipe } from '@ag/swipe-react';

export function App() {
  const swipeElement = useSwipe({
    onSwipeEnd: (event) => console.log(event)
  });

  return <div ref={swipeElement}>Swipe me!</div>
}

export default App;
