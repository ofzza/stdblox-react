import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { useGreeting, type GreetingState } from './index.js';

describe('useGreeting', () => {
  // Tests the `useGreeting` hook by rendering it with `renderHook`, and inspecting the state and root props it returns

  it('Greets the world by default', () => {
    const { result } = renderHook(() => useGreeting({}));
    expect(result.current.greeting).toBe('Hello World!');
  });

  it('Greets a given name', () => {
    const { result } = renderHook(() => useGreeting({ name: 'React' }));
    expect(result.current.greeting).toBe('Hello React!');
  });

  it('Passes native props and the ref on to the root element, but not its own props', () => {
    const ref = createRef<HTMLParagraphElement>();
    const { result } = renderHook(() => useGreeting({ name: 'React', id: 'greeting', className: 'greeting' }, ref));
    expect(result.current.getRootProps()).toEqual({ id: 'greeting', className: 'greeting', ref });
  });

  it('Returns the greeting state', () => {
    const { result } = renderHook(() => useGreeting({}));
    expectTypeOf(result.current).toEqualTypeOf<GreetingState>();
  });
});
