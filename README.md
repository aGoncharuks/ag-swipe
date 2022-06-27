# ag-swipe

The library exposes a single function ``createSwipeSubscription`` that attaches ``swipeEnd`` and/or ``swipeMove``event 
listeners to the provided DOM element and calls the event handler function when a revelant event occurs.

The function expects the following configuration object to be passed as an argument:
```typescript
interface SwipeSubscriptionConfig {
  domElement: HTMLElement;
  onSwipeMove?: (event: SwipeEvent) => void;
  onSwipeEnd?: (event: SwipeEvent) => void;
}
```

At least one of ``swipeEnd`` or ``swipeMove`` event handlers should be provided, but not necessarily both. 

Both ``swipeEnd`` and ``swipeMove`` listeners will emit an object implementing the ``SwipeEvent`` interface, which 
contains two fields:

- ``direction: 'y' | 'x'``  - defines swipe direction
- ``distance: number`` - defines swipe length in pixels


All four swipe directions (`right`, `left`, `up`, `down`) can be detected by filtering events by ``direction`` and 
``distance`` fields. 

For example, to detect the `right` swipe check if the following conditions are `true`:

```
direction === 'x' && distance > 0
```


## Wrappers for frameworks

There are three `npm` packages to choose from. Pick the one that fits your project best:

### Plain Javascript/Typescript

[Installation and usage](libs/swipe-core/src/README.md)

### Angular directive

[Installation and usage](libs/swipe-angular/README.md)

### React hook

[Installation and usage](libs/swipe-react/README.md)

