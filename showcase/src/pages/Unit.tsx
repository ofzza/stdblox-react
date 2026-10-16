/**
 * Showcase unit page: a unit's README preamble, followed by its showcase-component
 */

import { Component, Suspense, type ReactNode } from 'react';
import { Markdown } from '../Markdown.js';
import type { UnitPage } from '../registry.js';

// #region Error boundary

/**
 * Catches a showcase-component throwing, so one broken showcase never takes the whole showcase application down
 */
class _ShowcaseErrorBoundary extends Component<{ children: ReactNode }, { error?: unknown }> {
  state: { error?: unknown } = {};

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error === undefined) return this.props.children;
    return <pre className="showcase-error">Showcase failed: {String(this.state.error)}</pre>;
  }
}

// #endregion

// #region Unit page

/**
 * Renders a unit page
 * @param props.unit Unit to render
 * @returns Unit page
 */
export function Unit({ unit }: { unit: UnitPage }) {
  const { Showcase } = unit;
  return (
    <article>
      <Markdown dir={`src/${unit.path}`}>{unit.readme}</Markdown>
      <section className="showcase">
        <h2>Showcase</h2>
        {Showcase ? (
          <_ShowcaseErrorBoundary key={unit.path}>
            <Suspense fallback={<p>Loading…</p>}>
              <Showcase />
            </Suspense>
          </_ShowcaseErrorBoundary>
        ) : (
          <p>This unit has no showcase-component yet.</p>
        )}
      </section>
    </article>
  );
}

// #endregion
