/**
 * `useCounter` hook: all of the `Counter` component's logic
 */

import { useCallback, useState, type KeyboardEvent, type Ref } from 'react';
import type { CounterProps, CounterState } from './Counter.types.js';

// #region useCounter

/**
 * Gets the state of a `Counter`: its count, the actions changing it, and the props of each of its elements
 * @param props Counter props
 * @param ref Ref to forward to the root element
 * @returns Counter state
 */
export function useCounter(props: CounterProps, ref?: Ref<HTMLDivElement>): CounterState {
  const { initial: initialProp, min = -Infinity, max = Infinity, step = 1, onChange, onKeyDown, ...rootProps } = props;
  const initial = initialProp ?? (Number.isFinite(min) ? min : 0);
  const [count, setCount] = useState(initial);

  const update = useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next));
      if (clamped === count) return;
      setCount(clamped);
      onChange?.(clamped);
    },
    [count, min, max, onChange],
  );
  const increment = useCallback(() => update(count + step), [update, count, step]);
  const decrement = useCallback(() => update(count - step), [update, count, step]);
  const reset = useCallback(() => update(initial), [update, initial]);

  const canIncrement = count < max;
  const canDecrement = count > min;

  return {
    count,
    min,
    max,
    canIncrement,
    canDecrement,
    increment,
    decrement,
    reset,
    getRootProps: () => ({
      role: 'group',
      ...rootProps,
      ref,
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          e.preventDefault();
          increment();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          e.preventDefault();
          decrement();
        }
      },
    }),
    getDecrementProps: () => ({ type: 'button', 'aria-label': 'Decrement', disabled: !canDecrement, onClick: decrement }),
    getIncrementProps: () => ({ type: 'button', 'aria-label': 'Increment', disabled: !canIncrement, onClick: increment }),
    getCountProps: () => ({ 'aria-live': 'polite', 'aria-atomic': true }),
  };
}

// #endregion
