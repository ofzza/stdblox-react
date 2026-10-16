/**
 * `Counter` component: binds `useCounter` to `renderCounter`
 */

import { forwardRef } from 'react';
import type { CounterProps } from './Counter.types.js';
import { renderCounter } from './renderCounter.js';
import { useCounter } from './useCounter.js';

// #region Counter

/**
 * Renders a count, with buttons and arrow keys incrementing and decrementing it within optional bounds
 */
export const Counter = forwardRef<HTMLDivElement, CounterProps>((props, ref) => renderCounter(useCounter(props, ref)));
Counter.displayName = 'Counter';

// #endregion
