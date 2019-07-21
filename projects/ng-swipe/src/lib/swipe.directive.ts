/**
 * Directive should be added to HTML element that swipe action is listened on.
 * Callback function should be attached to host event 'swipeMove' or'swipeEnd' event depending on required functionality.
 * Event object contains two properties:
 * [direction]: 'y' | 'x'  - defines swipe direction is vertical or horizontal
 * [distance]: number - defines swipe length in pixels
 */
import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { elementAt, filter, map, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { SwipeCoordinates, SwipeDirection, SwipeEvent } from './interfaces';

@Directive({
  selector: '[ngSwipe]'
})

export class SwipeDirective implements OnInit, OnDestroy {

  @Output() swipeMove: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();
  @Output() swipeEnd: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

  /**
   * Property used to unsubscribe from all subscriptions on destroy event
   */
  private alive = true;

  constructor(
    private elementRef: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    const domElement = this.elementRef.nativeElement;
    
    const touchStarts: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchstart').pipe(map(this.touchEventToCoordinate));
    const touchMoves: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchmove').pipe(map(this.touchEventToCoordinate));
    const touchEnds: Observable<SwipeCoordinates> = fromEvent(domElement, 'touchend').pipe(map(this.touchEventToCoordinate));
    
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
      map(dragEvent => this.getSwipeDistance(dragStartEvent, dragEvent)),
      takeUntil(touchEnds.pipe(
        take(1),
        map(dragEndEvent => this.getSwipeDistance(dragStartEvent, dragEndEvent)),
        tap((coordinates: SwipeCoordinates) => this.emitSwipeEndEvent(direction, coordinates))
    )));

    const verticalMoves = verticalMoveStarts.pipe(
      switchMap(dragStartEvent => movesUntilEnds(dragStartEvent, 'y'))
    );
    const horizontalMoves = horizontalMoveStarts.pipe(
      switchMap(dragStartEvent => movesUntilEnds(dragStartEvent, 'x'))
    );
    
    /**
     * Run swipe subscriptions outside zone for better performance
     * On move emit swipe move event to parent element
     */
    this.zone.runOutsideAngular(() => {
      verticalMoves.pipe(
        takeWhile(() => this.alive)
      ).subscribe((coordinates: SwipeCoordinates) => this.emitSwipeMoveEvent('y', coordinates));
  
      horizontalMoves.pipe(
        takeWhile(() => this.alive)
      ).subscribe((coordinates: SwipeCoordinates) => this.emitSwipeMoveEvent('x', coordinates));
    });
  }

  /**
   * Set alive property to false to unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * Format touch event to coordinates object that is easier to read
   */
  public touchEventToCoordinate(touchEvent: TouchEvent): SwipeCoordinates  {
    return {
      x: touchEvent.changedTouches[0].clientX,
      y: touchEvent.changedTouches[0].clientY
    };
  }
  
  private getSwipeDistance(dragStartEvent, dragEvent): SwipeCoordinates {
    return {
      x: dragEvent.x - dragStartEvent.x,
      y: dragEvent.y - dragStartEvent.y
    };
  }

  /**
   * Emits swipe move event with calculated direction and distance
   */
  private emitSwipeMoveEvent(direction: SwipeDirection, coordinates: SwipeCoordinates) {
    this.swipeMove.emit({direction, distance: coordinates[direction]});
  }

  /**
   * Emits swipe move event with calculated direction and distance
   */
  private emitSwipeEndEvent(direction: SwipeDirection, coordinates: SwipeCoordinates) {
    this.swipeEnd.emit({direction, distance: coordinates[direction]});
  }
}
