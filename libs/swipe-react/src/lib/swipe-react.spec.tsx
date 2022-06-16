import { render } from '@testing-library/react';

import SwipeReact from './swipe-react';

describe('SwipeReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SwipeReact />);
    expect(baseElement).toBeTruthy();
  });
});
