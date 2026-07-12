// lint-staged runs formatters/linters on staged files in the pre-commit hook.
// Uses a function for Markdown so we can exclude generated OER snapshots: lint-staged passes
// ABSOLUTE paths, which the relative `ignores` in .markdownlint-cli2.jsonc don't match.
const quote = (files) => files.map((f) => `"${f}"`).join(' ');

export default {
  '*.{ts,js,json}': ['biome check --write --no-errors-on-unmatched'],
  '*.{yaml,yml}': ['prettier --write'],
  '*.md': (files) => {
    const authored = files.filter((f) => !f.includes('/oer-snapshots/'));
    if (authored.length === 0) return [];
    const list = quote(authored);
    return [`prettier --write ${list}`, `markdownlint-cli2 --fix ${list}`];
  },
};
