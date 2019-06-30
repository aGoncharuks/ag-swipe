export interface SwipeCoordinates {
  x: number;
  y: number;
}

export type SwipeDirection = 'y' | 'x';

export interface SwipeEvent {
  direction: SwipeDirection;
  distance: number;
}
