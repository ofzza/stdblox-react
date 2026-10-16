/**
 * Showcase application: the menu, mirroring the library's directory structure, next to the page of the current route
 */

import { registry, title } from './content.js';
import { Home } from './pages/Home.js';
import { Unit } from './pages/Unit.js';
import type { MenuGroup } from './registry.js';
import { useRoute } from './router.js';

// #region Menu

/**
 * Renders a menu group, and its children recursively
 * @param props.group Menu group to render
 * @param props.route Current route, whose menu item is highlighted
 * @returns Menu group
 */
function _MenuGroup({ group, route }: { group: MenuGroup; route: string }) {
  return (
    <li>
      <span className="menu-group">{group.name}</span>
      <ul>
        {group.children.map((child) =>
          child.kind === 'group' ? (
            <_MenuGroup key={child.path} group={child} route={route} />
          ) : (
            <li key={child.path}>
              <a href={`#/${child.path}`} aria-current={route === child.path ? 'page' : undefined}>
                {child.name}
              </a>
            </li>
          ),
        )}
      </ul>
    </li>
  );
}

// #endregion

// #region App

/**
 * Renders the showcase application
 * @returns Showcase application
 */
export function App() {
  const route = useRoute();
  const unit = registry.units.get(route);
  return (
    <div className="layout">
      <nav className="menu">
        <a className="menu-title" href="#/" aria-current={route === '' ? 'page' : undefined}>
          {title}
        </a>
        <ul>
          {registry.menu.map((group) => (
            <_MenuGroup key={group.path} group={group} route={route} />
          ))}
        </ul>
      </nav>
      <main className="content">
        {route === '' ? <Home /> : unit ? <Unit key={unit.path} unit={unit} /> : <p>Nothing is showcased at &quot;{route}&quot;.</p>}
      </main>
    </div>
  );
}

// #endregion
