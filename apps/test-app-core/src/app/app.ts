import { createSwipeSubscription, SwipeEvent } from 'ag-swipe-core';

const domElement: HTMLElement = document.querySelector('#swipe-element');

const swipeSubscription = createSwipeSubscription({
  domElement,
  onSwipeEnd: (event: SwipeEvent) => {
    console.log(`SwipeEnd direction: ${event.direction} and distance: ${event.distance}`);
  },
});

// When swipe events should no longer be tracked:
// if (typeof swipeSubscription?.unsubscribe === 'function') {
//  swipeSubscription.unsubscribe();
// }
