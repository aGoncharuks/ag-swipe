/**
 * Format touch event to coordinates object that is easier to read
 */
import { catchError, EMPTY, fromEvent, Observable, race, Subscription } from 'rxjs';
import { elementAt, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SwipeCoordinates, SwipeCoordinatesWithDirection, SwipeDirection, SwipeEvent, SwipeSubscriptionConfig } from './interfaces';


export function createSwipeSubscription({ domElement, onSwipeMove, onSwipeEnd }: SwipeSubscriptionConfig): Subscription {
  if (!(domElement instanceof HTMLElement)) {
    throw new Error('Provided domElement should be instance of HTMLElement');
  }

  if ((typeof onSwipeMove !== 'function') && (typeof onSwipeEnd !== 'function')) {
    throw new Error('At least one of the following swipe event handler functions should be provided: onSwipeMove and/or onSwipeEnd');
  }

  const touchStarts$: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchstart').pipe(map(getTouchCoordinates));
  const touchMoves$: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchmove').pipe(map(getTouchCoordinates));
  const touchEnds$: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchend').pipe(map(getTouchCoordinates));
  const touchCancels$: Observable<Event> = fromEvent(domElement, 'touchcancel');

  const touchStartsWithDirection$: Observable<SwipeCoordinatesWithDirection> = touchStarts$.pipe(
    switchMap((touchStartEvent: SwipeCoordinates) => touchMoves$.pipe(
      elementAt(3),
      map((touchMoveEvent: SwipeCoordinates) => ({
          x: touchStartEvent.x,
          y: touchStartEvent.y,
          direction: getTouchDirection(touchStartEvent, touchMoveEvent)
        })
      ))
    )
  );

  return touchStartsWithDirection$.pipe(
    switchMap(touchStartEvent => touchMoves$.pipe(
      map(touchMoveEvent => getTouchDistance(touchStartEvent, touchMoveEvent)),
      tap((coordinates: SwipeCoordinates) => {
        if (typeof onSwipeMove !== 'function') { return; }
        onSwipeMove(getSwipeEvent(touchStartEvent, coordinates));
      }),
      takeUntil(race(
        touchEnds$.pipe(
          map(touchEndEvent => getTouchDistance(touchStartEvent, touchEndEvent)),
          tap((coordinates: SwipeCoordinates) => {
            if (typeof onSwipeEnd !== 'function') { return; }
            onSwipeEnd(getSwipeEvent(touchStartEvent, coordinates));
          })
        ),
        touchCancels$
      ))
    )),
    catchError(error => {
      console.error(error);
      return EMPTY;
    }),
  ).subscribe();
}

function getTouchCoordinates(touchEvent: TouchEvent): SwipeCoordinates  {
  return {
    x: touchEvent.changedTouches[0].clientX,
    y: touchEvent.changedTouches[0].clientY
  };
}

function getSwipeEvent(touchStartEvent, coordinates): SwipeEvent  {
  return {
    direction: touchStartEvent.direction,
    distance: coordinates[touchStartEvent.direction]
  };
}

function getTouchDistance(touchStartEvent, touchEvent): SwipeCoordinates {
  return {
    x: touchEvent.x - touchStartEvent.x,
    y: touchEvent.y - touchStartEvent.y
  };
}

function getTouchDirection(touchStartEvent, touchEvent): SwipeDirection {
  const { x, y } = getTouchDistance(touchStartEvent, touchEvent);
  return Math.abs(x) < Math.abs(y) ? SwipeDirection.Y : SwipeDirection.X;
}
