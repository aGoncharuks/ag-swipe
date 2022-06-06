/**
 * Format touch event to coordinates object that is easier to read
 */
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { elementAt, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { SwipeCoordinates, SwipeDirection, SwipeListenerConfig } from './interfaces';


export function initializeSwipeListener({ domElement, onSwipeMove, onSwipeEnd }: SwipeListenerConfig): Subscription {
  const touchStarts: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchstart').pipe(map(touchEventToCoordinate));
  const touchMoves: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchmove').pipe(map(touchEventToCoordinate));
  const touchEnds: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchend').pipe(map(touchEventToCoordinate));

  /**
   * Move starts with direction: Pair the move start events with the 3rd subsequent move event,
   * but only if no touch end event happens in between
   */
  const moveStartsWithDirection = touchStarts.pipe(
    switchMap((dragStartEvent: SwipeCoordinates) => touchMoves.pipe(
      elementAt(3),
      map((dragEvent: SwipeCoordinates) => {
        const intialDeltaX = dragEvent.x - dragStartEvent.x;
        const initialDeltaY = dragEvent.y - dragStartEvent.y;
        return {x: dragStartEvent.x, y: dragStartEvent.y, intialDeltaX, initialDeltaY};
      })
  )));

  /**
   * Vertical move starts: Keep only those move start events
   * where the 3rd subsequent move event is rather vertical than horizontal
   */
  const verticalMoveStarts = moveStartsWithDirection.pipe(
    filter(dragStartEvent => Math.abs(dragStartEvent.intialDeltaX) < Math.abs(dragStartEvent.initialDeltaY)
  ));

  /**
   * Horizontal move starts: Keep only those move start events
   * where the 3rd subsequent move event is rather horizontal than vertical
   */
  const horizontalMoveStarts = moveStartsWithDirection.pipe(
    filter(dragStartEvent => Math.abs(dragStartEvent.intialDeltaX) >= Math.abs(dragStartEvent.initialDeltaY))
  );

  /**
   * Take the moves until touch ends
   * On move end emit swipe end event to parent element
   */
  const movesUntilEnds = (dragStartEvent: any, direction: SwipeDirection) => touchMoves.pipe(
    map(dragEvent => getSwipeDistance(dragStartEvent, dragEvent)),
    takeUntil(touchEnds.pipe(
      take(1),
      map(dragEndEvent => getSwipeDistance(dragStartEvent, dragEndEvent)),
      tap((coordinates: SwipeCoordinates) => onSwipeEnd({ direction, distance: coordinates[direction] }))
  )));

  const verticalMoves = verticalMoveStarts.pipe(
    switchMap(dragStartEvent => movesUntilEnds(dragStartEvent, 'y'))
  );
  const horizontalMoves = horizontalMoveStarts.pipe(
    switchMap(dragStartEvent => movesUntilEnds(dragStartEvent, 'x'))
  );

  return merge(
    verticalMoves.pipe(
      tap((coordinates: SwipeCoordinates) => onSwipeMove({ direction: 'y', distance: coordinates.y }))
    ),
    horizontalMoves.pipe(
      tap((coordinates: SwipeCoordinates) => onSwipeMove({ direction: 'x', distance: coordinates.x }))
    )
  ).subscribe();
}

export function touchEventToCoordinate(touchEvent: TouchEvent): SwipeCoordinates  {
  return {
    x: touchEvent.changedTouches[0].clientX,
    y: touchEvent.changedTouches[0].clientY
  };
}

export function getSwipeDistance(dragStartEvent, dragEvent): SwipeCoordinates {
  return {
    x: dragEvent.x - dragStartEvent.x,
    y: dragEvent.y - dragStartEvent.y
  };
}
