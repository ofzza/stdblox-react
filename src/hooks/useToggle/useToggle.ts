/**
 * `useToggle` hook: a placeholder general purpose hook, establishing the structure of a hook unit
 */

import { useCallback, useState } from 'react';

// #region useToggle

/**
 * Represents what `useToggle` returns: the current value, a function toggling it, and a function setting it
 */
export type UseToggleResult = [value: boolean, toggle: () => void, set: (value: boolean) => void];

/**
 * Gets a boolean state value, along with stable functions toggling and setting it
 * @param initial Initial value
 * @returns Current value, a function toggling it, and a function setting it
 */
export function useToggle(initial: boolean = false): UseToggleResult {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((current) => !current), []);
  const set = useCallback((next: boolean) => setValue(next), []);
  return [value, toggle, set];
}

// #endregion
