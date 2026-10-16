/**
 * Showcase router: a minimal hash router, so the built showcase can be served as static files from any sub-path
 */

import { useSyncExternalStore } from 'react';

// #region Router

/**
 * Subscribes to route changes
 * @param onChange Called whenever the route changes
 * @returns Unsubscribes
 */
function _subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/**
 * Gets the current route: the part of the URL hash after `#/`
 * @returns Current route, `''` for the home page
 */
function _getRoute(): string {
  return window.location.hash.startsWith('#/') ? decodeURIComponent(window.location.hash.slice(2)) : '';
}

/**
 * Gets the current route, re-rendering whenever it changes
 * @returns Current route, `''` for the home page
 */
export function useRoute(): string {
  return useSyncExternalStore(_subscribe, _getRoute, () => '');
}

// #endregion
