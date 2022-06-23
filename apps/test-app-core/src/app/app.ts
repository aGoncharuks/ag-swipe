import { createSwipeSubscription, SwipeEvent } from '@ag/swipe-core';

const domElement: HTMLElement = document.querySelector('#swipe-element');

createSwipeSubscription({
  domElement,
  onSwipeEnd: (event: SwipeEvent) => {
    console.log(`SwipeEnd direction: ${event.direction} and distance: ${event.distance}`);
  },
});
