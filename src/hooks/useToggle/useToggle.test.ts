import { act, renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { useToggle, type UseToggleResult } from './index.js';

describe('useToggle', () => {
  // Tests the `useToggle` hook by rendering it with `renderHook`, and acting on the functions it returns

  it('Starts with false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('Starts with the given initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('Toggles the value', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });

  it('Sets the value', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[2](true));
    expect(result.current[0]).toBe(true);
  });

  it('Returns stable functions across renders', () => {
    // Consumers pass these functions to memoised children and effect dependencies, so they must not change identity
    const { result, rerender } = renderHook(() => useToggle());
    const [, toggle, set] = result.current;
    act(() => toggle());
    rerender();
    expect(result.current[1]).toBe(toggle);
    expect(result.current[2]).toBe(set);
  });

  it('Returns a typed tuple', () => {
    const { result } = renderHook(() => useToggle());
    expectTypeOf(result.current).toEqualTypeOf<UseToggleResult>();
  });
});
