# @ag/swipe
A small library to detect swipes on touchscreen devices.

Attaches ``swipeEnd`` and/or ``swipeMove`` event listeners to the provided DOM element and calls provided event 
handler functions when corresponding events occur.

At least one of ``swipeEnd`` or ``swipeMove`` event handlers should be provided, but no necessarily both. 

Both ``swipeEnd`` and ``swipeMove`` listeners will emit an object implementing the ``SwipeEvent`` interface, which 
contains two fields:

- ``direction: 'y' | 'x'``  - defines swipe direction
- ``distance: number`` - defines swipe length in pixels


All four swipe directions (`right`, `left`, `up`, `down`) can be detected by filtering events by ``direction`` and 
``distance`` fields. 

For example, to detect the `right` swipe check if the foolowing conditions are `true`:

``direction === 'x' && distance > 0``



##Wrappers for frameworks

There are three `npm` packages to choose from. Pick the one that fits your project best:

### Plain Javascript/Typescript

[Installation and usage](libs/swipe-core/src/README.md)

### Angular directive

[Installation and usage](libs/swipe-angular/README.md)

### React hook

[Installation and usage](libs/swipe-react/README.md)

