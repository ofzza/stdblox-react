/**
 * `Counter` component types: its props, and the state its hook returns
 */

import type { ButtonHTMLAttributes, HTMLAttributes, Ref } from 'react';

// #region Types

/**
 * Represents the props of the `Counter` component, and of its `useCounter` hook
 */
export interface CounterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Initial count, and the count `reset()` returns to, defaulting to `min` when it is set, or `0`
   */
  initial?: number;
  /**
   * Lowest allowed count, defaulting to no limit
   */
  min?: number;
  /**
   * Highest allowed count, defaulting to no limit
   */
  max?: number;
  /**
   * Amount each increment and decrement changes the count by, defaulting to `1`
   */
  step?: number;
  /**
   * Called with the new count whenever it changes
   * @param count New count
   */
  onChange?: (count: number) => void;
}

/**
 * Represents the state of a `Counter`, as returned by `useCounter`, and as rendered by `renderCounter` or by a custom presentation
 */
export interface CounterState {
  /**
   * Current count
   */
  count: number;
  /**
   * Lowest allowed count
   */
  min: number;
  /**
   * Highest allowed count
   */
  max: number;
  /**
   * If the count can still be incremented without passing `max`
   */
  canIncrement: boolean;
  /**
   * If the count can still be decremented without passing `min`
   */
  canDecrement: boolean;
  /**
   * Increments the count by `step`, up to `max`
   */
  increment(): void;
  /**
   * Decrements the count by `step`, down to `min`
   */
  decrement(): void;
  /**
   * Resets the count to `initial`
   */
  reset(): void;
  /**
   * Gets the props of the root element: every native prop passed to the component, its group role, its arrow key handling, and the
   * forwarded ref
   * @returns Root element props
   */
  getRootProps(): HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };
  /**
   * Gets the props of the element decrementing the count
   * @returns Decrement button props
   */
  getDecrementProps(): ButtonHTMLAttributes<HTMLElement>;
  /**
   * Gets the props of the element incrementing the count
   * @returns Increment button props
   */
  getIncrementProps(): ButtonHTMLAttributes<HTMLElement>;
  /**
   * Gets the props of the element displaying the count, announcing its changes to assistive technologies
   * @returns Count display props
   */
  getCountProps(): HTMLAttributes<HTMLElement>;
}

// #endregion
