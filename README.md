## Usage

`ngSwipe` directive should be added to HTML element that swipe action is listened on.<br />
Callback function should be attached to host event `(swipeMove)` or `(swipeEnd)` event depending on required functionality
.<br />
Event object contains two properties:<br />
`direction`: 'y' | 'x'  - defines swipe direction is vertical or horizontal<br />
`distance`: number - defines swipe length in pixels
