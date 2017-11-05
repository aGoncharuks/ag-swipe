/**
 * Directive should be added to HTML element that swipe action is listened on.
 * Callback function should be attached to host event 'onSwipeMove' or'onSwipeEnd' event depending on required functionality.
 * Event object contains two properties:
 * [direction]: 'vertical' | 'horizontal'  - defines swipe direction is vertical or horizontal
 * [distance]: number - defines swipe length in pixels
 */
import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SwipeCoordinates, SwipeEvent } from './interfaces';

@Directive({
  selector: '[stylistSwipe]'
})

export class SwipeDirective implements OnInit, OnDestroy {

  @Output() onSwipeMove: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();
  @Output() onSwipeEnd: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

  /**
   * Property used to unsubscribe from all subscriptions on destroy event
   * @type {boolean}
   */
  private alive: boolean = true;

  constructor(
    private elementRef: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit() {

    let domElement = this.elementRef.nativeElement;

    let touchStarts: Observable<any>;
    let touchMoves: Observable<any>;
    let touchEnds: Observable<any>;

    /** Run event listeners outside zone for better performance */
    this.zone.runOutsideAngular(() => {
      touchStarts = Observable.fromEvent(domElement, 'touchstart').map(this.touchEventToCoordinate);
      touchMoves = Observable.fromEvent(domElement, 'touchmove').map(this.touchEventToCoordinate);
      touchEnds = Observable.fromEvent(domElement, 'touchend').map(this.touchEventToCoordinate);
    });

    /**
     * Move starts with direction: Pair the move start events with the 3rd subsequent move event,
     * but only if no end event happens in between
     */
    let moveStartsWithDirection = touchStarts.concatMap((dragStartEvent: SwipeCoordinates) =>
      touchMoves
        .takeUntil(touchEnds)
        .elementAt(3)
        .catch(err => Observable.empty())
        .map((dragEvent: SwipeCoordinates) => {
          const intialDeltaX = dragEvent.x - dragStartEvent.x;
          const initialDeltaY = dragEvent.y - dragStartEvent.y;
          return {x: dragStartEvent.x, y: dragStartEvent.y, intialDeltaX, initialDeltaY};
        })
    );

    /**
     * Vertical move starts: Keep only those move start events
     * where the 3rd subsequent move event is rather vertical than horizontal
     */
    let verticalMoveStarts = moveStartsWithDirection.filter(dragStartEvent =>
      Math.abs(dragStartEvent.intialDeltaX) < Math.abs(dragStartEvent.initialDeltaY)
    );

    /**
     * Horizontal move starts: Keep only those move start events
     * where the 3rd subsequent move event is rather horizontal than vertical
     */
    let horizontalMoveStarts = moveStartsWithDirection.filter(dragStartEvent =>
      Math.abs(dragStartEvent.intialDeltaX) >= Math.abs(dragStartEvent.initialDeltaY)
    );

    /**
     * Take the moves until an end occurs
     * @param dragStartEvent
     */
    const movesUntilEnds = (dragStartEvent: any) =>
      touchMoves.takeUntil(touchEnds).map(dragEvent => {
        const x = dragEvent.x - dragStartEvent.x;
        const y = dragEvent.y - dragStartEvent.y;
        return {x, y};
      });

    let verticalMoves = verticalMoveStarts.concatMap(movesUntilEnds);
    let horizontalMoves = horizontalMoveStarts.concatMap(movesUntilEnds);

    /**
     * Last move event that ends swipe
     * @param dragStartEvent
     */
    const lastMovesAtEnds = (dragStartEvent: any) =>
      touchEnds.first().map(dragEndEvent => {
        const x = dragEndEvent.x - dragStartEvent.x;
        const y = dragEndEvent.y - dragStartEvent.y;
        return {x, y};
      });

    let verticalMoveEnds = verticalMoveStarts.concatMap(lastMovesAtEnds);
    let horizontalMoveEnds = horizontalMoveStarts.concatMap(lastMovesAtEnds);

    /**
     * Subscribe to swipe events
     * When swipe move or swipe end happens - emit corresponding events to parent element
     */
    verticalMoves
      .takeWhile(() => this.alive)
      .subscribe((coordinates: SwipeCoordinates) => {
        this.emitSwipeMoveEvent('vertical', coordinates.y);
      });

    horizontalMoves
      .takeWhile(() => this.alive)
      .subscribe((coordinates: SwipeCoordinates) => {
        this.emitSwipeMoveEvent('horizontal', coordinates.x);
      });

    verticalMoveEnds
      .takeWhile(() => this.alive)
      .subscribe((coordinates: SwipeCoordinates) => {
        this.emitSwipeEndEvent('vertical', coordinates.y);
      });

    horizontalMoveEnds
      .takeWhile(() => this.alive)
      .subscribe((coordinates: SwipeCoordinates) => {
        this.emitSwipeEndEvent('horizontal', coordinates.x);
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
   * @param touchEvent
   * @returns {{x: number, y: number}}
   */
  public touchEventToCoordinate(touchEvent: TouchEvent): SwipeCoordinates  {
    return {
      x: touchEvent.changedTouches[0].clientX,
      y: touchEvent.changedTouches[0].clientY
    };
  }

  /**
   * Emits swipe move event with calculated direction and distance
   */
  private emitSwipeMoveEvent(direction: string, distance: number) {
    this.onSwipeMove.emit({direction, distance});
  }

  /**
   * Emits swipe move event with calculated direction and distance
   */
  private emitSwipeEndEvent(direction: string, distance: number) {
    this.onSwipeEnd.emit({direction, distance});
  }

}
