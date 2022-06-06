export interface SwipeCoordinates {
  x: number;
  y: number;
}

export type SwipeDirection = 'y' | 'x';

export interface SwipeEvent {
  direction: SwipeDirection;
  distance: number;
}

export interface SwipeListenerConfig {
  domElement: HTMLElement;
  onSwipeMove: (event: SwipeEvent) => void;
  onSwipeEnd: (event: SwipeEvent) => void;
}
