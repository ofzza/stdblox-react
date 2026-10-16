/**
 * Consumer smoke test: packs the library, installs the tarball into a throwaway consumer project together with a real install of the given
 * React version, then type checks `smoke-test/smoke.tsx` under both `nodenext` and `bundler` module resolution, and compiles and runs it
 *
 * Usage: `node scripts/smoke-test.mjs <react major>` (or `npm run smoke -- <react major>`), defaulting to the default React version
 */

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getReactVersions, rootDir } from './react-versions.mjs';

const versions = getReactVersions();
const major = process.argv[2] ?? versions.default;
const supported = [versions.default, ...versions.additional.map((version) => version.major)];
if (!supported.includes(major)) {
  console.error(`React ${major} is not supported, expected one of: ${supported.join(', ')}`);
  process.exit(1);
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
const dir = mkdtempSync(join(tmpdir(), `stdblox-react-smoke-${major}-`));

try {
  console.log(`Packing the library into ${dir}`);
  run(npm, ['pack', '--silent', '--pack-destination', dir], rootDir);
  const tarball = readdirSync(dir).find((file) => file.endsWith('.tgz'));

  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'smoke', private: true, type: 'module' }, null, 2));
  run(
    npm,
    [
      'install',
      '--no-audit',
      '--no-fund',
      `./${tarball}`,
      `react@${major}`,
      `react-dom@${major}`,
      `@types/react@${major}`,
      `@types/react-dom@${major}`,
      'typescript@5',
    ],
    dir,
  );
  copyFileSync(join(rootDir, 'scripts', 'smoke-test', 'smoke.tsx'), join(dir, 'smoke.tsx'));

  const tsc = join(dir, 'node_modules', 'typescript', 'bin', 'tsc');
  const common = ['--strict', '--jsx', 'react-jsx', '--target', 'es2022', '--types', 'react,react-dom', 'smoke.tsx'];
  console.log('Type checking under nodenext resolution');
  run(process.execPath, [tsc, '--noEmit', '--module', 'nodenext', '--moduleResolution', 'nodenext', ...common], dir);
  console.log('Type checking under bundler resolution');
  run(process.execPath, [tsc, '--noEmit', '--module', 'esnext', '--moduleResolution', 'bundler', ...common], dir);
  console.log('Compiling and running');
  run(process.execPath, [tsc, '--module', 'nodenext', '--moduleResolution', 'nodenext', '--outDir', 'out', ...common], dir);
  run(process.execPath, [join(dir, 'out', 'smoke.js')], dir);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
