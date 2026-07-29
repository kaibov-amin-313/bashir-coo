import nextConfig from "eslint-config-next";

/**
 * Bashir&Co — ESLint flat config.
 *
 * `eslint-config-next`'s main export is already a native ESLint 9 flat-config
 * array (Linter.Config[]) — no `FlatCompat`/legacy eslintrc bridge is needed
 * or used here. If a future Claude session sees a lint error suggesting
 * `FlatCompat`, that is almost certainly the wrong, older pattern for this
 * dependency version — check this file's actual export shape again before
 * reintroducing it.
 */
const eslintConfig = [...nextConfig];

export default eslintConfig;
