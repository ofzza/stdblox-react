# Publishing

How to release a new version of `@ofzza/stdblox-react` to NPM. Releases are cut from `develop` and published from `master`, following the branching model in [AGENTS.md](./AGENTS.md#branching). Pushing `master` also deploys the showcase application to GitHub Pages, once CI passes.

> Before the first publish, check that the `homepage`, `bugs` and `repository` URLs in `package.json` match the real GitHub repository, and that its Pages source is set to "GitHub Actions" in its settings.

## Before each publish

- [ ] **`develop` is clean and in sync with `origin`**: `git status` shows nothing to commit, and `git pull` brings in nothing new.
- [ ] **CI is green** for the head of `develop` on GitHub, on `CI / Node 22`, `CI / Node 24` and every `CI / React <major> consumer`.
- [ ] **`npm run ci` passes locally**: build, showcase, ESLint, Prettier and the tests under every supported React version, type checks included.
- [ ] **The documentation matches the code**: the `README.md` `# Usage` section links every unit re-exported from `src/index.ts`, every unit's `README.md` documents its current API, and the code samples in all of them have been checked against `tsc`.
- [ ] **The compatibility table in `README.md` is current**, and matches the `react` peer dependency range.
- [ ] **The package contents are right**: `npm pack --dry-run` lists only `dist/`, `README.md`, `LICENSE` and `package.json`, with no `*.test.*` files under `dist/`.
- [ ] **The packed tarball works for a consumer**: see [Consumer smoke test](#consumer-smoke-test) below.
- [ ] **The new version has been chosen** following the versioning policy in [AGENTS.md](./AGENTS.md#versioning) (independent semver: a narrowed React peer range, or a breaking change to a component's state, is a major), and does not appear in `npm view <package> versions`. Nothing may be published under a version that has been used before, even one that was unpublished.
- [ ] **You are logged in to NPM**: `npm whoami` prints an account that may publish the package (and its scope, if scoped). If not, run `npm login`.
- [ ] **`master` can be fast-forwarded to `develop`**: `git log develop..master` prints nothing. If it prints commits (a hotfix, for example), merge `master` into `develop` first and start this checklist again.

### Consumer smoke test

Run the smoke test against every supported React major (`node scripts/react-versions.mjs list` prints them). It packs the library, installs the tarball into a throwaway project together with that React version, type checks `scripts/smoke-test/smoke.tsx` under both `nodenext` and `bundler` module resolution, then compiles and runs it:

```sh
$ npm run smoke -- 19
$ npm run smoke -- 18
```

CI runs the same, as `CI / React <major> consumer`. Check that `scripts/smoke-test/smoke.tsx` uses every export of the release.

## Packaging and publishing

1. **Bump the version on `develop`.** `npm version` updates `package.json` and `package-lock.json`, commits the change, and tags the commit as `v<version>`:

   ```sh
   $ git switch develop
   $ npm version <major|minor|patch|x.y.z>
   ```

2. **Push `develop` with the tag**, and wait for CI to pass on the version commit:

   ```sh
   $ git push --follow-tags origin develop
   ```

3. **Fast-forward `master` to `develop`** and push it, so that `master` points at exactly the tagged commit:

   ```sh
   $ git switch master
   $ git pull --ff-only
   $ git merge --ff-only develop
   $ git push origin master
   ```

4. **Publish from `master`.** `prepublishOnly` runs `npm run ci` first and aborts the publish if anything fails. `publishConfig.access` is already `public`, so `--access public` is not needed:

   ```sh
   $ npm publish
   ```

   A prerelease version (`x.y.z-alpha.n`, `-beta.n`, `-rc.n`) is rejected with "You must specify a tag using --tag when publishing a prerelease version". Publish it under its prerelease identifier, so that `latest` stays reserved for stable releases:

   ```sh
   $ npm publish --tag alpha
   ```

   If the account uses 2FA for publishing, also pass `--otp=<code>`. `prepublishOnly` runs before the upload, so use a freshly generated code.

   A release for an older React version, whose support was already dropped from `latest` (see [AGENTS.md](./AGENTS.md#versioning)), is published under a dist-tag naming that React version instead, so that `latest` is never moved backwards:

   ```sh
   $ npm publish --tag react18
   ```

5. **Verify the release**: `npm view <package> version` prints the new version, and installing `<package>@<version>` into a fresh project works. For a prerelease, check `npm view <package> dist-tags` instead, since `version` follows `latest`. Right after a package's _first_ publish, the registry may keep answering 404 for a while, because a 404 fetched before the publish stays cached. The tarball at `https://registry.npmjs.org/<package>/-/<package>-<version>.tgz` is available immediately and can be installed directly to verify.

6. **Switch back to `develop`** to continue work:

   ```sh
   $ git switch develop
   ```
