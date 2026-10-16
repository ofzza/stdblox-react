import { render } from '@testing-library/react';
import { version, type ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

/**
 * Every showcase-component of the library, keyed by its path
 */
const _showcases = import.meta.glob<{ default: ComponentType }>('./**/*.showcase.tsx', { eager: true });

describe('showcases', () => {
  // Tests that every showcase-component renders, under every supported React version, so that the showcase application can not silently
  // break. Each one is rendered into jsdom and must produce content without throwing

  it('Finds showcases', () => {
    expect(Object.keys(_showcases).length).toBeGreaterThan(0);
  });

  it.each(Object.entries(_showcases))(`Renders %s (React ${version})`, (_path, module) => {
    const Showcase = module.default;
    expect(Showcase).toBeTypeOf('function');
    const { container } = render(<Showcase />);
    expect(container).not.toBeEmptyDOMElement();
  });
});
