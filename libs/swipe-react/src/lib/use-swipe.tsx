import { createSwipeSubscription, SwipeSubscriptionConfig } from '@ag/swipe-core';
import { RefCallback, useCallback } from 'react';
import { Subscription } from 'rxjs';

export const useSwipe = (config: Pick<SwipeSubscriptionConfig, 'onSwipeMove' | 'onSwipeEnd'>): RefCallback<HTMLElement> => {
  let swipeSubscription: Subscription | undefined;

  return useCallback((domElement: HTMLElement) => {
    if (domElement) {
      swipeSubscription = createSwipeSubscription({
        domElement,
        ...config
      });
    } else if (typeof swipeSubscription?.unsubscribe === 'function') {
      swipeSubscription.unsubscribe();
    }
  }, []);
}
