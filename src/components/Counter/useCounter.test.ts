import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useCounter, type CounterProps, type CounterState } from './index.js';

/**
 * Creates a minimal keyboard event for calling a root `onKeyDown` handler directly
 * @param key Pressed key
 * @returns Keyboard event
 */
function _keyDown(key: string): KeyboardEvent<HTMLDivElement> {
  let defaultPrevented = false;
  return {
    key,
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  } as KeyboardEvent<HTMLDivElement>;
}

describe('useCounter', () => {
  // Tests the `useCounter` hook, which holds all of the `Counter` logic, by rendering it with `renderHook`, calling its actions and prop
  // getters inside `act`, and inspecting the state it returns

  describe('Count', () => {
    // Covers the initial count, and how the actions change it within the bounds

    it('Starts at 0 by default', () => {
      const { result } = renderHook(() => useCounter({}));
      expect(result.current.count).toBe(0);
    });

    it('Starts at min when only min is set', () => {
      const { result } = renderHook(() => useCounter({ min: 5 }));
      expect(result.current.count).toBe(5);
    });

    it('Starts at the given initial count', () => {
      const { result } = renderHook(() => useCounter({ initial: 3, min: 1 }));
      expect(result.current.count).toBe(3);
    });

    it('Increments and decrements by step', () => {
      const { result } = renderHook(() => useCounter({ step: 2 }));
      act(() => result.current.increment());
      expect(result.current.count).toBe(2);
      act(() => result.current.decrement());
      act(() => result.current.decrement());
      expect(result.current.count).toBe(-2);
    });

    it('Clamps the count to min and max', () => {
      const { result } = renderHook(() => useCounter({ initial: 1, min: 0, max: 2, step: 5 }));
      act(() => result.current.increment());
      expect(result.current.count).toBe(2);
      act(() => result.current.decrement());
      expect(result.current.count).toBe(0);
    });

    it('Resets to the initial count', () => {
      const { result } = renderHook(() => useCounter({ initial: 4 }));
      act(() => result.current.increment());
      act(() => result.current.reset());
      expect(result.current.count).toBe(4);
    });

    it('Reports whether the count can still change', () => {
      const { result } = renderHook(() => useCounter({ min: 0, max: 1 }));
      expect(result.current).toMatchObject({ canDecrement: false, canIncrement: true });
      act(() => result.current.increment());
      expect(result.current).toMatchObject({ canDecrement: true, canIncrement: false });
    });
  });

  describe('onChange', () => {
    // Covers when the change callback is, and is not, called

    it('Is called with the new count', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useCounter({ onChange }));
      act(() => result.current.increment());
      expect(onChange).toHaveBeenCalledExactlyOnceWith(1);
    });

    it('Is not called when the count is clamped in place', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useCounter({ max: 0, onChange }));
      act(() => result.current.increment());
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Prop getters', () => {
    // Covers the props each element of a presentation gets, which is what lets a custom presentation reuse the behaviour and accessibility
    // of the default one

    it('Passes native props and the ref on to the root element, but not its own props', () => {
      const ref = createRef<HTMLDivElement>();
      const props: CounterProps = { initial: 1, min: 0, max: 9, step: 1, onChange: () => {}, id: 'counter', 'aria-label': 'Quantity' };
      const { result } = renderHook(() => useCounter(props, ref));
      const rootProps = result.current.getRootProps();
      expect(rootProps).toMatchObject({ role: 'group', id: 'counter', 'aria-label': 'Quantity', ref });
      expect(rootProps).not.toHaveProperty('initial');
      expect(rootProps).not.toHaveProperty('onChange');
    });

    it('Increments and decrements on arrow keys', () => {
      const { result } = renderHook(() => useCounter({}));
      act(() => result.current.getRootProps().onKeyDown!(_keyDown('ArrowUp')));
      act(() => result.current.getRootProps().onKeyDown!(_keyDown('ArrowRight')));
      expect(result.current.count).toBe(2);
      act(() => result.current.getRootProps().onKeyDown!(_keyDown('ArrowDown')));
      act(() => result.current.getRootProps().onKeyDown!(_keyDown('ArrowLeft')));
      expect(result.current.count).toBe(0);
    });

    it('Lets a passed onKeyDown prevent the arrow key handling', () => {
      const onKeyDown = vi.fn((e: KeyboardEvent<HTMLDivElement>) => e.preventDefault());
      const { result } = renderHook(() => useCounter({ onKeyDown }));
      act(() => result.current.getRootProps().onKeyDown!(_keyDown('ArrowUp')));
      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(result.current.count).toBe(0);
    });

    it('Disables the buttons at the bounds', () => {
      const { result } = renderHook(() => useCounter({ min: 0, max: 0 }));
      expect(result.current.getDecrementProps()).toMatchObject({ type: 'button', disabled: true });
      expect(result.current.getIncrementProps()).toMatchObject({ type: 'button', disabled: true });
    });

    it('Announces count changes politely', () => {
      const { result } = renderHook(() => useCounter({}));
      expect(result.current.getCountProps()).toEqual({ 'aria-live': 'polite', 'aria-atomic': true });
    });
  });

  it('Returns the counter state', () => {
    const { result } = renderHook(() => useCounter({}));
    expectTypeOf(result.current).toEqualTypeOf<CounterState>();
  });
});
