/**
 * Directive should be added to HTML element that swipe action is listened on.
 * Callback function should be attached to host event 'swipeMove' or'swipeEnd' event depending on required functionality.
 * Event object contains two properties:
 * [direction]: 'y' | 'x'  - defines swipe direction is vertical or horizontal
 * [distance]: number - defines swipe length in pixels
 */
import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwipeEvent } from '../../../swipe-core/src/lib/swipe-core.types';
import { createSwipeSubscription } from '@swipe/swipe-core';

@Directive({
  selector: '[ngSwipe]'
})

export class SwipeDirective implements OnInit, OnDestroy {
  private swipeSubscription: Subscription | undefined;

  @Output() swipeMove: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();
  @Output() swipeEnd: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

  constructor(
    private elementRef: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.swipeSubscription = createSwipeSubscription({
        domElement: this.elementRef.nativeElement,
        onSwipeMove: (swipeMoveEvent: SwipeEvent) => this.swipeMove.emit(swipeMoveEvent),
        onSwipeEnd: (swipeEndEvent: SwipeEvent) => this.swipeEnd.emit(swipeEndEvent)
      });
    });
  }

  ngOnDestroy() {
    if (!this.swipeSubscription) { return; }
    this.swipeSubscription.unsubscribe();
  }
}